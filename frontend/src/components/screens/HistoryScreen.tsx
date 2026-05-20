import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useAppStore } from '../../hooks/useAppStore';
import { supabase } from '../../lib/supabase';

export const HistoryScreen = ({ t, onShowDetail }: any) => {
  const { user } = useAppStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    if (!user?.id) {
      setError('User belum login atau ID tidak ditemukan.');
      setLoading(false);
      return;
    }

    console.log('[HistoryScreen] Fetching transactions for user.id:', user.id);

    // Coba langsung ke Supabase dulu
    const { data, error: dbError } = await supabase
      .from('transactions')
      .select(`
        id,
        order_number,
        created_at,
        total_price,
        status,
        payment_method,
        transaction_items (
          id,
          quantity,
          unit_price,
          subtotal,
          products ( name )
        )
      `)
      .eq('member_id', user.id)
      .order('created_at', { ascending: false });

    if (!dbError) {
      console.log('[HistoryScreen] Supabase direct:', data?.length, 'records');
      setTransactions(data || []);
      setLoading(false);
      return;
    }

    // Jika Supabase gagal (RLS), fallback ke backend API
    console.warn('[HistoryScreen] Supabase direct failed, falling back to API:', dbError.message);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${API_URL}/transactions/${user.id}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const apiData = await res.json();
      console.log('[HistoryScreen] Backend API:', apiData?.length, 'records');
      setTransactions(apiData || []);
    } catch (apiErr: any) {
      console.error('[HistoryScreen] Both methods failed:', apiErr.message);
      setError(`Gagal memuat riwayat: ${apiErr.message}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 pb-32 space-y-6 max-w-sm mx-auto"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">{t.history}</h2>
        {!loading && (
          <button
            onClick={fetchTransactions}
            className="p-2 rounded-xl text-cobalt-blue hover:bg-cobalt-blue/10 transition-colors"
          >
            <RefreshCcw size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="animate-spin text-cobalt-blue" size={32} />
            <p className="text-xs text-slate-500">Memuat riwayat transaksi...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <AlertCircle className="text-red-400" size={32} />
            <p className="text-sm text-red-400 font-medium">{error}</p>
            <button
              onClick={fetchTransactions}
              className="text-xs text-cobalt-blue underline mt-1"
            >
              Coba lagi
            </button>
          </div>
        ) : transactions.length > 0 ? (
          transactions.map(tx => (
            <GlassCard
              key={tx.id}
              onClick={() => {
                onShowDetail({
                  id: tx.order_number || `TX-${tx.id.toString().substring(0, 8)}`,
                  date: new Date(tx.created_at).toLocaleString('id-ID'),
                  items: (tx.transaction_items || []).map((item: any) => ({
                    qty: item.quantity,
                    name: item.products?.name || 'Produk',
                    price: item.unit_price,
                  })),
                  method: tx.payment_method || 'Cash',
                  total: tx.total_price || 0,
                  points: 0,
                });
              }}
              className="p-4 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-theme-bg-secondary rounded-2xl text-cobalt-blue border border-theme-border">
                  <Package size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {tx.order_number || `TX-${tx.id.toString().substring(0, 8)}`}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(tx.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {tx.transaction_items?.length || 0} item
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">Rp {tx.total_price?.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-green-500 font-medium capitalize">
                  {tx.status || 'completed'}
                </p>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Package className="text-slate-300" size={40} />
            <p className="text-center text-slate-500 text-sm">{t.noTransactionHistory}</p>
            {user?.id && (
              <p className="text-[10px] text-slate-400">User ID: {user.id.substring(0, 8)}...</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
