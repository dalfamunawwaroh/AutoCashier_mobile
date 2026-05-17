import { Router } from 'express';
import { supabase, supabaseAdmin } from '../supabaseClient';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('whatsapp', phone)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        return res.status(401).json({ error: 'Akun belum terdaftar, silahkan register terlebih dahulu.' });
      }
      throw userError;
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'PIN atau Password salah.' });
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

    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+62' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    // Gunakan Admin API untuk baypass SMS Provider rules
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      phone: formattedPhone,
      password: password,
      phone_confirm: true,
      email_confirm: true,
      user_metadata: {
        display_name: username,
        full_name: username
      }
    });

    if (authError) {
      if (authError.message.includes('already exists') || authError.message.includes('registered')) {
        return res.status(400).json({ error: 'Nomor WhatsApp sudah terdaftar. Silahkan login.' });
      }
      return res.status(400).json({ error: authError.message + ' (Pastikan Anda memasukkan VITE_SUPABASE_SERVICE_ROLE_KEY di backend/.env)' });
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Gagal mendaftar ke sistem Autentikasi.' });
    }

    // Hash password sebelum masuk public.users
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke public.users
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
      await supabase.from('member_points').insert({
        user_id: data.id,
        balance: 0
      });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat register.' });
  }
});

router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, avatar } = req.body;

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
      .select('full_name, role, avatar_url, username')
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
