import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Peringatan: Kredensial Supabase belum di-set di file .env!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface TransactionPayload {
  memberId: string;
  items: Array<{ id: string; name: string; price: number; qty: number }>;
  subtotal: number;
  discount: number;
  total: number;
  pointsEarned: number;
  voucherCode: string | null;
}

export const saveTransaction = async (
  memberId: string,
  items: TransactionPayload['items'],
  subtotal: number,
  discount: number,
  total: number,
  pointsEarned: number,
  voucherCode: string | null
): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/transactions`, {
      memberId,
      items,
      subtotal,
      discount,
      total,
      pointsEarned,
      voucherCode,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Gagal menyimpan transaksi'
    );
  }
};
