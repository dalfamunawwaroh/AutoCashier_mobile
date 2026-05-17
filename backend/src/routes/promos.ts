import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// Get all available promos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('member_promos')
      .select('*')
      .is('user_id', null)
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
    
    // Check if user already claimed it
    const { data: existing } = await supabase
      .from('member_promos')
      .select('id')
      .eq('user_id', userId)
      .eq('code', promoCode)
      .single();

    if (existing) {
       return res.status(400).json({ error: 'Anda sudah mengklaim voucher ini.' });
    }

    // Get promo template
    const { data: promoTemplate, error: fetchError } = await supabase
      .from('member_promos')
      .select('*')
      .is('user_id', null)
      .eq('code', promoCode)
      .single();

    if (fetchError || !promoTemplate) {
      return res.status(404).json({ error: 'Promo tidak ditemukan.' });
    }

    const { error } = await supabase
      .from('member_promos')
      .insert({
        user_id: userId,
        code: promoTemplate.code,
        discount_type: promoTemplate.discount_type,
        discount_value: promoTemplate.discount_value,
        min_purchase: promoTemplate.min_purchase,
        expires_at: promoTemplate.expires_at,
        is_used: false
      });

    if (error) {
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
    
    const { data, error } = await supabase
      .from('member_promos')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('is_used', false);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
