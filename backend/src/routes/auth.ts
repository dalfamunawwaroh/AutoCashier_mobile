import { Router } from 'express';
import { supabase, supabaseAdmin } from '../supabaseClient';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import * as dns from 'dns';
import validator from 'email-validator';

const router = Router();
const JWT_SECRET = process.env.VITE_SUPABASE_ANON_KEY || 'super-secret-key-123';

const normalizePhoneForDB = (phone: string) => {
  let cleaned = phone.replace(/\D/g, ''); // Hapus semua karakter non-angka
  if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.substring(2);
  }
  return cleaned;
};

const normalizePhoneForAuth = (phone: string) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return '+' + cleaned;
};

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const dbPhone = normalizePhoneForDB(phone);

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

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password salah.' });
    }

    res.json(userData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat login.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email wajib diisi.' });
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Akun dengan email tersebut tidak ditemukan.' });
    }

    // Generate a reset token using JWT (expires in 15 minutes)
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:3000/?reset=${resetToken}`;

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'admin.autocashier@gmail.com',
        pass: process.env.EMAIL_PASS || 'TOLONG_GANTI_DENGAN_APP_PASSWORD' 
      }
    });

    const mailOptions = {
      from: '"AutoCashier Support" <admin.autocashier@gmail.com>',
      to: email,
      subject: 'Reset Password AutoCashier',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #fff; border-radius: 12px;">
          <h2 style="color: #0ea5e9;">AutoCashier - Reset Password</h2>
          <p>Halo ${user.full_name},</p>
          <p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk membuat password baru:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #3b82f6; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Link ini hanya berlaku selama 15 menit.</p>
          <br/>
          <p style="color: #64748b; font-size: 12px;">Jika Anda tidak merasa meminta reset password, abaikan saja pesan ini.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

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

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Link reset password tidak valid atau sudah kadaluarsa.' });
    }

    const userId = decoded.userId;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userId);

    if (updateError) throw updateError;

    res.json({ message: 'Password berhasil diubah. Silakan login dengan password baru.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat mengubah password.' });
  }
});

// In-memory store for OTP registrations (In production, use Redis or DB)
const pendingRegistrations = new Map<string, any>();

// Helper to check MX records
const checkMxRecords = (domain: string): Promise<boolean> => {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) resolve(false);
      else resolve(true);
    });
  });
};

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
    const disposableDomains = ['10minutemail.com', 'temp-mail.org', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];
    if (disposableDomains.includes(domain.toLowerCase())) {
      return res.status(400).json({ error: 'Email sementara (disposable) tidak diizinkan.' });
    }

    const hasMx = await checkMxRecords(domain);
    if (!hasMx) {
      return res.status(400).json({ error: 'Domain email tidak ditemukan atau tidak aktif.' });
    }

    const dbPhone = normalizePhoneForDB(phone);

    // Check if user already exists
    const { data: existingUser } = await supabase.from('users').select('id').or(`email.eq.${email},whatsapp.eq.${dbPhone}`).single();
    if (existingUser) {
      return res.status(400).json({ error: 'Email atau Nomor WhatsApp sudah terdaftar.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    pendingRegistrations.set(email, {
      username,
      email,
      phone: dbPhone,
      password,
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'admin.autocashier@gmail.com',
        pass: process.env.EMAIL_PASS || 'TOLONG_GANTI_DENGAN_APP_PASSWORD' 
      }
    });

    await transporter.sendMail({
      from: '"AutoCashier Support" <admin.autocashier@gmail.com>',
      to: email,
      subject: 'Kode OTP Registrasi AutoCashier',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #fff; border-radius: 12px;">
          <h2 style="color: #0ea5e9;">AutoCashier - Verifikasi Email</h2>
          <p>Halo ${username},</p>
          <p>Terima kasih telah mendaftar. Masukkan kode OTP berikut untuk mengaktifkan akun Anda:</p>
          <div style="background: #1e1b4b; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; color: #fff; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>Kode ini hanya berlaku selama 15 menit.</p>
        </div>
      `
    });

    res.json({ message: 'Kode OTP telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat register.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const pendingData = pendingRegistrations.get(email);
    if (!pendingData) {
      return res.status(400).json({ error: 'Sesi registrasi tidak ditemukan atau sudah kadaluarsa. Silakan daftar ulang.' });
    }

    if (Date.now() > pendingData.expiresAt) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ error: 'Kode OTP sudah kadaluarsa. Silakan daftar ulang.' });
    }

    if (pendingData.otp !== otp) {
      return res.status(400).json({ error: 'Kode OTP salah.' });
    }

    // OTP Valid! Proceed with Supabase Auth & Users table insert
    const { username, phone, password } = pendingData;
    const authPhone = normalizePhoneForAuth(phone);

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      phone: authPhone,
      password: password,
      phone_confirm: true,
      email_confirm: true,
      user_metadata: { display_name: username, full_name: username }
    });

    if (authError || !authData.user) {
      return res.status(400).json({ error: authError?.message || 'Gagal membuat akun di Autentikasi.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username: username,
        email: email,
        full_name: username,
        whatsapp: phone,
        password: hashedPassword,
        role: 'member'
      })
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      await supabase.from('member_points').insert({ user_id: data.id, balance: 0 });
    }

    pendingRegistrations.delete(email);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat memverifikasi OTP.' });
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

    const updates: any = {
      full_name: name
    };

    let finalAvatarUrl = avatar;

    if (avatar && avatar.startsWith('data:image')) {
      const matches = avatar.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const type = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const ext = type.split('/')[1] || 'jpg';
        const fileName = `${id}_${Date.now()}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('avatars')
          .upload(fileName, buffer, {
            contentType: type,
            upsert: true
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(fileName);
          finalAvatarUrl = publicUrl;
        } else {
          console.error('Storage upload error:', uploadError);
        }
      }
    }

    if (finalAvatarUrl) {
      updates.avatar_url = finalAvatarUrl;
    }

    if (username && username !== existingUser.username) {
      if (existingUser.username_updated_at) {
        const lastUpdate = new Date(existingUser.username_updated_at);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        if (lastUpdate > twoWeeksAgo) {
          return res.status(400).json({ error: 'Username hanya bisa diubah 14 hari sekali.' });
        }
      }
      updates.username = username;
      updates.username_updated_at = new Date().toISOString();
    }

    if (email && email !== existingUser.email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { email });
      if (authError && authError.code !== 'user_not_found') {
        console.error('Failed to update Auth Email:', authError);
        // Continue even if auth update fails, but log it
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
      if (updateError.code === '42703' && updateError.message.includes('username_updated_at')) {
        return res.status(400).json({ error: 'Database belum mendukung limit 14 hari. Tolong tambahkan kolom username_updated_at (tipe: timestamptz) di tabel users.' });
      }
      throw updateError;
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Gagal mengupdate profil.' });
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

    const { data: pointData, error: pointError } = await supabase
      .from('member_points')
      .select('balance')
      .eq('user_id', id)
      .single();

    res.json({
      ...userData,
      points: pointData?.balance || 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
