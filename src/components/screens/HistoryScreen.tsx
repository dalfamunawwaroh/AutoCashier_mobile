import React from 'react';
import { motion } from 'motion/react';
import { Package } from 'lucide-react';
import { TRANSACTION_HISTORY } from '../../constants/mockData';
import { GlassCard } from '../common/GlassCard';

export const HistoryScreen = ({ t, onShowDetail }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="p-6 pb-32 space-y-6 max-w-sm mx-auto"
  >
    <h2 className="text-2xl font-black">{t.history}</h2>
    <div className="space-y-4">
      {TRANSACTION_HISTORY.map(tx => (
        <GlassCard key={tx.id} onClick={() => onShowDetail(tx)} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-theme-bg-secondary rounded-2xl text-cobalt-blue border border-theme-border">
              <Package size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">{tx.id}</p>
              <p className="text-[10px] text-slate-500">{tx.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">Rp {tx.total.toLocaleString()}</p>
            <p className="text-[10px] text-green-500 font-medium">Success</p>
          </div>
        </GlassCard>
      ))}
    </div>
  </motion.div>
);
