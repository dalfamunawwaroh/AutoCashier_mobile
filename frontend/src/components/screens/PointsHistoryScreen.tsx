import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { POINTS_HISTORY } from '../../constants/mockData';
import { GlassCard } from '../common/GlassCard';
import { cn } from '../../lib/utils';

export const PointsHistoryScreen = ({ t, onBack }: any) => {
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
              <h1 className="text-4xl font-black">1.250</h1>
            </div>
            <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
              <Zap size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-32 space-y-4">
        {POINTS_HISTORY.map(item => (
          <GlassCard key={item.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl flex items-center justify-center",
                item.type === 'earn' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {item.type === 'earn' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-[10px] text-slate-500">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-bold text-sm",
                item.type === 'earn' ? "text-green-500" : "text-red-500"
              )}>
                {item.type === 'earn' ? '+' : ''}{item.points}
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Points</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
};
