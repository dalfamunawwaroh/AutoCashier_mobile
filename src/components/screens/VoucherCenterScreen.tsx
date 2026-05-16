import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Ticket, Info } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { VOUCHERS } from '../../constants/mockData';
import { GlassCard } from '../common/GlassCard';
import { cn } from '../../lib/utils';

export const VoucherCenterScreen = ({ t, onBack }: any) => {
  const { collectedVoucherCodes, claimVoucher } = useAppStore();

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
        {VOUCHERS.map(v => {
          const isCollected = collectedVoucherCodes.includes(v.code);
          return (
            <GlassCard key={v.code} className="p-5 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-cobalt-blue opacity-50" />
              <div className="flex items-center gap-4">
                <div className="p-4 bg-cobalt-blue/10 text-cobalt-blue rounded-2xl">
                  <Ticket size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">{v.code}</p>
                  <p className="text-xs text-slate-500 font-semibold mb-1">{v.desc}</p>
                  <p className="text-[10px] text-cobalt-blue font-bold uppercase tracking-tighter">Berlaku s/d 2026</p>
                </div>
              </div>
              <button 
                onClick={() => !isCollected && claimVoucher(v.code)}
                disabled={isCollected}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300",
                  isCollected 
                    ? "bg-theme-bg-secondary text-slate-400 border border-theme-border" 
                    : "bg-cobalt-blue text-white shadow-neon hover:scale-105 active:scale-95"
                )}
              >
                {isCollected ? t.claimed : t.claim}
              </button>
            </GlassCard>
          );
        })}
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
