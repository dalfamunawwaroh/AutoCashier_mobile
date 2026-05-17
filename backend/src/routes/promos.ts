import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// Get all available promos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('member_promo')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Claim a promo
router.post('/claim', async (req, res) => {
  try {
    const { userId, promoCode } = req.body;
    
    // Check if user_promos table exists by trying to select from it
    const { error: checkError } = await supabase.from('user_promos').select('id').limit(1);
    if (checkError && checkError.code === '42P01') {
      return res.status(400).json({ error: 'Tolong buat tabel user_promos (id, user_id, promo_code) di database Anda terlebih dahulu.' });
    }

    const { data, error } = await supabase
      .from('user_promos')
      .insert({
        user_id: userId,
        promo_code: promoCode
      });

    if (error) {
       if (error.code === '23505') {
         return res.status(400).json({ error: 'Anda sudah mengklaim voucher ini.' });
       }
       throw error;
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get claimed promos by user
router.get('/claimed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // First try to get claimed promo codes
    const { data: claims, error: claimsError } = await supabase
      .from('user_promos')
      .select('promo_code')
      .eq('user_id', userId);

    if (claimsError) {
      if (claimsError.code === '42P01') {
        // Table doesn't exist yet, return empty
        return res.json([]);
      }
      throw claimsError;
    }

    const codes = claims.map(c => c.promo_code);

    if (codes.length > 0) {
      const { data: promos, error: promosError } = await supabase
        .from('member_promo')
        .select('*')
        .in('code', codes);
        
      if (promosError) throw promosError;
      return res.json(promos);
    }
    
    res.json([]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
