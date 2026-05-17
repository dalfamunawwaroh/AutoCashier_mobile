import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Zap, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../hooks/useAppStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const PointsHistoryScreen = ({ t, onBack }: any) => {
  const { user } = useAppStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointsHistory = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(`${API_URL}/transactions/${user.id}/points`);
        setHistory(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPointsHistory();
  }, [user?.id]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="safe-h-screen w-full bg-theme-bg overflow-y-auto scrollbar-hide max-w-sm mx-auto"
    >
      <div className="sticky top-0 z-30 bg-theme-bg/80 backdrop-blur-xl px-6 pt-8 pb-4 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 glass rounded-2xl border border-theme-border flex items-center justify-center">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <h2 className="text-2xl font-black">{t.pointsHistory}</h2>
        </div>

        <div className="relative group overflow-hidden rounded-[2.5rem] shadow-neon">
          <div className="absolute inset-0 bg-gradient-to-br from-cobalt-blue to-hot-pink opacity-80" />
          <div className="relative p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{t.pointsBalance}</p>
              <h1 className="text-4xl font-black">{(user?.points || 0).toLocaleString('id-ID')}</h1>
            </div>
            <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
              <Zap size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-32 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-cobalt-blue" size={32} /></div>
        ) : history.length > 0 ? (
          history.map(item => (
            <GlassCard key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl flex items-center justify-center",
                  item.type === 'earn' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {item.type === 'earn' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.note}</p>
                  <p className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold text-sm",
                  item.type === 'earn' ? "text-green-500" : "text-red-500"
                )}>
                  {item.type === 'earn' ? '+' : '-'}{item.points}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Points</p>
              </div>
            </GlassCard>
          ))
        ) : (
          <p className="text-center text-slate-500 text-sm py-10">Belum ada riwayat poin</p>
        )}
      </div>
    </motion.div>
  );
};
