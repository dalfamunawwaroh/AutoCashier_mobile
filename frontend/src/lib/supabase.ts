import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Peringatan: Kredensial Supabase belum di-set di file .env mobile!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const saveTransaction = async (memberId: string, items: any[], subtotal: number, discount: number, total: number, pointsEarned: number, voucherCode: string | null) => {
  try {
    const response = await axios.post(`${API_URL}/transactions`, {
      memberId, items, subtotal, discount, total, pointsEarned, voucherCode
    });
    return response.data;
  } catch (error: any) {
    console.error('Error saving transaction:', error);
    throw new Error(error.response?.data?.error || 'Failed to save transaction');
  }
};