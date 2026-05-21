import { Router } from 'express';
import { supabase, supabaseAdmin } from '../supabaseClient';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import * as dns from 'dns';
import validator from 'email-validator';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_ANON_KEY || 'super-secret-key-123';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts any phone format to local Indonesian format (08xx) for DB storage */
const normalizePhoneForDb = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) cleaned = '0' + cleaned.substring(2);
  return cleaned;
};

/** Converts local Indonesian phone format to E.164 (+62xx) for Supabase Auth */
const normalizePhoneForAuth = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1);
  return '+' + cleaned;
};

/** Returns true if the domain has at least one MX record (with a permissive fallback) */
const hasMxRecord = (domain: string): Promise<boolean> =>
  new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        console.warn(`MX check failed for ${domain}: ${err.message}. Bypassing.`);
        return resolve(true);
      }
      resolve(addresses.length > 0);
    });
  });

/** Singleton nodemailer transporter — reused across all email sends */
const createMailTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'admin.autocashier@gmail.com',
      pass: process.env.EMAIL_PASS || '',
    },
  });

// In-memory OTP store (use Redis in production for multi-instance deployments)
const pendingRegistrations = new Map<string, {
  username: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  expiresAt: number;
}>();

const DISPOSABLE_DOMAINS = [
  '10minutemail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
];

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const dbPhone = normalizePhoneForDb(phone);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('whatsapp', dbPhone)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        return res.status(401).json({ error: 'Akun belum terdaftar, silahkan register terlebih dahulu.' });
      }
      throw userError;
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password salah.' });
    }

    res.json(userData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat login.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({ error: 'Format email tidak valid.' });
    }

    const domain = email.split('@')[1];
    if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) {
      return res.status(400).json({ error: 'Email sementara (disposable) tidak diizinkan.' });
    }

    const mxExists = await hasMxRecord(domain);
    if (!mxExists) {
      return res.status(400).json({ error: 'Domain email tidak ditemukan atau tidak aktif.' });
    }

    const dbPhone = normalizePhoneForDb(phone);
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},whatsapp.eq.${dbPhone}`)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email atau Nomor WhatsApp sudah terdaftar.' });
    }

    const otp = Math.floor(100_000 + Math.random() * 900_000).toString();
    pendingRegistrations.set(email, {
      username,
      email,
      phone: dbPhone,
      password,
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    await createMailTransporter().sendMail({
      from: '"AutoCashier Support" <admin.autocashier@gmail.com>',
      to: email,
      subject: 'Kode OTP Registrasi AutoCashier',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#0a0a0a;color:#fff;border-radius:12px;">
          <h2 style="color:#0ea5e9;">AutoCashier - Verifikasi Email</h2>
          <p>Halo ${username},</p>
          <p>Terima kasih telah mendaftar. Masukkan kode OTP berikut untuk mengaktifkan akun Anda:</p>
          <div style="background:#1e1b4b;padding:15px;border-radius:8px;text-align:center;margin:20px 0;">
            <h1 style="margin:0;color:#fff;letter-spacing:5px;">${otp}</h1>
          </div>
          <p>Kode ini hanya berlaku selama 15 menit.</p>
        </div>
      `,
    });

    res.json({ message: 'Kode OTP telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat register.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pending = pendingRegistrations.get(email);

    if (!pending) {
      return res.status(400).json({ error: 'Sesi registrasi tidak ditemukan atau sudah kadaluarsa. Silakan daftar ulang.' });
    }

    if (Date.now() > pending.expiresAt) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ error: 'Kode OTP sudah kadaluarsa. Silakan daftar ulang.' });
    }

    if (pending.otp !== otp) {
      return res.status(400).json({ error: 'Kode OTP salah.' });
    }

    const { username, phone, password } = pending;
    const authPhone = normalizePhoneForAuth(phone);

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      phone: authPhone,
      password,
      phone_confirm: true,
      email_confirm: true,
      user_metadata: { display_name: username, full_name: username },
    });

    if (authError || !authData.user) {
      return res.status(400).json({ error: authError?.message || 'Gagal membuat akun di Autentikasi.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username,
        email,
        full_name: username,
        whatsapp: phone,
        password: hashedPassword,
        role: 'member',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Initialise the member_points row
    if (newUser) {
      await supabase.from('member_points').insert({ user_id: newUser.id, balance: 0 });
    }

    pendingRegistrations.delete(email);
    res.json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat memverifikasi OTP.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email wajib diisi.' });

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Akun dengan email tersebut tidak ditemukan.' });
    }

    // Token expires in 15 minutes
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/?reset=${resetToken}`;

    await createMailTransporter().sendMail({
      from: '"AutoCashier Support" <admin.autocashier@gmail.com>',
      to: email,
      subject: 'Reset Password AutoCashier',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#0a0a0a;color:#fff;border-radius:12px;">
          <h2 style="color:#0ea5e9;">AutoCashier - Reset Password</h2>
          <p>Halo ${user.full_name},</p>
          <p>Klik tombol di bawah ini untuk membuat password baru:</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${resetLink}" style="background:#3b82f6;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
          </div>
          <p>Link ini hanya berlaku selama 15 menit.</p>
          <p style="color:#64748b;font-size:12px;">Jika Anda tidak merasa meminta reset password, abaikan saja pesan ini.</p>
        </div>
      `,
    });

    res.json({ message: 'Link reset password telah dikirim ke email.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Gagal mengirim email. Pastikan konfigurasi email di server sudah benar.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token dan password baru wajib diisi.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(400).json({ error: 'Link reset password tidak valid atau sudah kadaluarsa.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', decoded.userId);

    if (updateError) throw updateError;

    res.json({ message: 'Password berhasil diubah. Silakan login dengan password baru.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat mengubah password.' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('full_name, role, avatar_url, username, email, whatsapp')
      .eq('id', id)
      .single();

    if (userError) throw userError;

    const { data: pointData } = await supabase
      .from('member_points')
      .select('balance')
      .eq('user_id', id)
      .single();

    res.json({ ...userData, points: pointData?.balance || 0 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, avatar, email } = req.body;

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const updates: Record<string, any> = { full_name: name };
    let resolvedAvatarUrl = avatar;

    // Upload base64 avatar to Supabase Storage if provided
    if (avatar?.startsWith('data:image')) {
      const matches = avatar.match(/^data:([A-Za-z+/-]+);base64,(.+)$/);
      if (matches?.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const ext = mimeType.split('/')[1] || 'jpg';
        const fileName = `${id}_${Date.now()}.${ext}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from('avatars')
          .upload(fileName, buffer, { contentType: mimeType, upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(fileName);
          resolvedAvatarUrl = publicUrl;
        } else {
          console.error('Avatar upload error:', uploadError);
        }
      }
    }

    if (resolvedAvatarUrl) updates.avatar_url = resolvedAvatarUrl;

    if (username && username !== existingUser.username) {
      if (existingUser.username_updated_at) {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        if (new Date(existingUser.username_updated_at) > twoWeeksAgo) {
          return res.status(400).json({ error: 'Username hanya bisa diubah 14 hari sekali.' });
        }
      }
      updates.username = username;
      updates.username_updated_at = new Date().toISOString();
    }

    if (email && email !== existingUser.email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { email });
      if (authError && authError.code !== 'user_not_found') {
        console.error('Auth email update failed:', authError);
      }
      updates.email = email;
    }

    const { data, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      if (
        updateError.code === '42703' &&
        updateError.message.includes('username_updated_at')
      ) {
        return res.status(400).json({
          error:
            'Database belum mendukung limit 14 hari. Tolong tambahkan kolom username_updated_at (tipe: timestamptz) di tabel users.',
        });
      }
      throw updateError;
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Gagal mengupdate profil.' });
  }
});

export default router;
