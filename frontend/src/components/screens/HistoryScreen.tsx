import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Loader2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useAppStore } from '../../hooks/useAppStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const HistoryScreen = ({ t, onShowDetail }: any) => {
  const { user } = useAppStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      
      try {
        const response = await axios.get(`${API_URL}/transactions/${user.id}`);
        setTransactions(response.data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 pb-32 space-y-6 max-w-sm mx-auto"
    >
      <h2 className="text-2xl font-black">{t.history}</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-cobalt-blue" size={32} />
          </div>
        ) : transactions.length > 0 ? (
          transactions.map(tx => (
            <GlassCard key={tx.id} onClick={() => onShowDetail(tx)} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-theme-bg-secondary rounded-2xl text-cobalt-blue border border-theme-border">
                  <Package size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">TX-{tx.id.substring(0, 5)}</p>
                  <p className="text-[10px] text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">Rp {tx.total_price?.toLocaleString()}</p>
                <p className="text-[10px] text-green-500 font-medium">{tx.status || 'Success'}</p>
              </div>
            </GlassCard>
          ))
        ) : (
          <p className="text-center text-slate-500 text-sm py-10">Belum ada riwayat transaksi</p>
        )}
      </div>
    </motion.div>
  );
};
