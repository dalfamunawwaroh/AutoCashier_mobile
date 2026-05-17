import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { memberId, items, total, pointsEarned, voucherCode } = req.body;
    
    const orderNumber = `TX-${Date.now()}`;
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .insert({
        order_number: orderNumber,
        cashier_id: memberId,
        total_price: total,
        status: 'completed',
        payment_method: 'cash',
        payment_status: 'verified'
      })
      .select()
      .single();

    if (txError) throw txError;

    if (txData) {
      const txItems = items.map((item: any) => ({
        transaction_id: txData.id,
        product_id: item.id,
        quantity: item.qty,
        unit_price: item.price,
        subtotal: item.price * item.qty
      }));

      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(txItems);

      if (itemsError) throw itemsError;
      
      if (pointsEarned > 0 && memberId) {
         await supabase.from('point_transactions').insert({
           user_id: memberId,
           transaction_id: txData.id,
           type: 'earn',
           points: pointsEarned,
           note: voucherCode ? `Earned with voucher ${voucherCode}` : 'Earned from transaction'
         });

         const { data: pointData } = await supabase.from('member_points').select('balance').eq('user_id', memberId).single();
         if (pointData) {
           await supabase.from('member_points').update({ balance: (pointData.balance || 0) + pointsEarned }).eq('user_id', memberId);
         }
      }
    }
    
    res.json(txData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const { data, error } = await supabase
      .from('transactions')
      .select('*, transaction_items(*)')
      .eq('cashier_id', memberId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:memberId/points', async (req, res) => {
  try {
    const { memberId } = req.params;
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('user_id', memberId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
