import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const TransactionDetailModal = ({ transaction, onClose, t }: any) => {
  if (!transaction) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full glass-modal rounded-t-[2.5rem] p-8 max-w-lg lg:rounded-[2.5rem] lg:mb-8 mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black">{t.detailTitle}</h3>
            <button onClick={onClose} className="p-2 glass rounded-full"><X size={20} /></button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between text-xs">
              <div className="text-slate-500">{t.invoice}</div>
              <div className="font-semibold">{transaction.id}</div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="text-slate-500">{t.date}</div>
              <div className="font-semibold">{transaction.date}</div>
            </div>

            <div className="h-[1px] bg-theme-border w-full" />

            <div className="space-y-3">
              {transaction.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <div>
                    <span className="font-semibold">{item.qty}x</span> {item.name}
                  </div>
                  <div className="font-medium">Rp {(item.qty * item.price).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-theme-border w-full border-dashed" />

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <div className="text-slate-500">{t.paymentMethod}</div>
                <div className="font-semibold">{transaction.method}</div>
              </div>
              <div className="flex justify-between text-xs">
                <div className="text-slate-500">{t.status}</div>
                <div className="text-green-500 font-bold">{t.statusSuccess}</div>
              </div>
            </div>

            <div className="bg-cobalt-blue/5 rounded-2xl p-6 flex justify-between items-center mt-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.total}</p>
                <p className="text-2xl font-black text-cobalt-blue">Rp {transaction.total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Points</p>
                <p className="text-sm font-black text-hot-pink">+{transaction.points}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
