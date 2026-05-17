import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Ticket, Info, Loader2 } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { cn } from '../../lib/utils';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const VoucherCenterScreen = ({ t, onBack }: any) => {
  const { user, collectedVouchers, setCollectedVouchers } = useAppStore();
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promosRes = await axios.get(`${API_URL}/promos`);
        setPromos(promosRes.data);
        
        if (user?.id) {
          const claimedRes = await axios.get(`${API_URL}/promos/claimed/${user.id}`);
          setCollectedVouchers(claimedRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, [user?.id]);

  const handleClaim = async (promoCode: string) => {
    if (!user?.id) return;
    setClaiming(promoCode);
    try {
      await axios.post(`${API_URL}/promos/claim`, { userId: user.id, promoCode });
      const claimedRes = await axios.get(`${API_URL}/promos/claimed/${user.id}`);
      setCollectedVouchers(claimedRes.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengklaim voucher');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="safe-min-h-screen bg-theme-bg p-6 pb-32 space-y-6 max-w-sm mx-auto"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 glass rounded-2xl border border-theme-border flex items-center justify-center"><ChevronRight className="rotate-180" size={20} /></button>
        <h2 className="text-2xl font-black">{t.voucherCenter}</h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-cobalt-blue" size={32} /></div>
        ) : promos.length > 0 ? (
          promos.map(v => {
            const isCollected = collectedVouchers.some(cv => cv.code === v.code);
          return (
            <GlassCard key={v.code} className="p-5 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-cobalt-blue opacity-50" />
              <div className="flex items-center gap-4">
                <div className="p-4 bg-cobalt-blue/10 text-cobalt-blue rounded-2xl">
                  <Ticket size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">{v.code}</p>
                  <p className="text-xs text-slate-500 font-semibold mb-1">{v.title || v.description || 'Diskon Spesial'}</p>
                  <p className="text-[10px] text-cobalt-blue font-bold uppercase tracking-tighter">
                    {v.valid_until ? `Berlaku s/d ${new Date(v.valid_until).toLocaleDateString()}` : 'Promo Aktif'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => !isCollected && handleClaim(v.code)}
                disabled={isCollected || claiming === v.code}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 min-w-[80px]",
                  isCollected 
                    ? "bg-theme-bg-secondary text-slate-400 border border-theme-border" 
                    : "bg-cobalt-blue text-white shadow-neon hover:scale-105 active:scale-95"
                )}
              >
                {claiming === v.code ? <Loader2 size={12} className="animate-spin mx-auto" /> : (isCollected ? t.claimed : t.claim)}
              </button>
            </GlassCard>
          );
        })
        ) : (
          <p className="text-center text-slate-500 text-sm py-10">Belum ada promo yang tersedia.</p>
        )}
      </div>

      <div className="p-6 glass rounded-3xl border-cobalt-blue/10 bg-cobalt-blue/5">
        <div className="flex items-start gap-4">
           <div className="p-2 bg-cobalt-blue/20 rounded-lg text-cobalt-blue mt-1">
             <Info size={16} />
           </div>
           <div>
             <p className="text-xs font-semibold text-theme-text mb-1">Cara Menggunakan</p>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               Voucher yang telah diambil akan otomatis muncul di halaman pembayaran saat Anda melakukan checkout di terminal.
             </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
