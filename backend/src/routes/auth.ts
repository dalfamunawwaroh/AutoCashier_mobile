import { Router } from 'express';
import { supabase, supabaseAdmin } from '../supabaseClient';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Format phone
    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+62' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password: password,
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        return res.status(401).json({ error: 'Nomor WhatsApp atau Password salah, atau akun belum terdaftar.' });
      }
      return res.status(400).json({ error: authError.message });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    res.json(userData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan saat login.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
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
      phone: formattedPhone,
      password: password,
      phone_confirm: true,
      user_metadata: {
        display_name: name,
        full_name: name
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

    // Insert ke public.users
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username: phone,
        email: `${phone}@autocashier.local`, // dummy email untuk unique constraint
        full_name: name,
        whatsapp: phone,
        password: password,
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

router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('full_name, role')
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
