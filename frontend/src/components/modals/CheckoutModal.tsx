import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ticket, ChevronRight, Check } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { VOUCHERS } from '../../constants/mockData';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

export const CheckoutModal = ({ isOpen, onClose, onFinish, t }: any) => {
  const { cart, activeVoucherCode, setActiveVoucher, collectedVoucherCodes, pointPercentage } = useAppStore();
  
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const activeVoucher = VOUCHERS.find(v => v.code === activeVoucherCode);
  const discount = activeVoucher ? activeVoucher.discount : 0;
  const total = Math.max(0, subtotal - discount);
  const pointsEarned = Math.floor(total * (pointPercentage / 100));

  const collectedVouchers = VOUCHERS.filter(v => collectedVoucherCodes.includes(v.code));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-end justify-center">
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
          className="relative w-full glass-modal rounded-t-[2.5rem] p-8 max-w-lg mx-auto overflow-y-auto max-h-[90vh] scrollbar-hide"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black">{t.cart}</h3>
            <button onClick={onClose} className="p-2 glass rounded-full"><X size={20} /></button>
          </div>

          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-theme-bg-secondary p-4 rounded-2xl border border-theme-border">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.qty}x @ Rp {item.price.toLocaleString()}</p>
                </div>
                <p className="text-sm font-black">Rp {(item.qty * item.price).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.myVouchers}</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {collectedVouchers.length > 0 ? collectedVouchers.map(v => (
                <button 
                  key={v.code}
                  onClick={() => setActiveVoucher(activeVoucherCode === v.code ? null : v.code)}
                  className={cn(
                    "flex-shrink-0 px-4 py-3 rounded-2xl border flex items-center gap-2 transition-all",
                    activeVoucherCode === v.code 
                      ? "bg-cobalt-blue text-white border-cobalt-blue shadow-neon" 
                      : "bg-theme-bg-secondary border-theme-border text-slate-500"
                  )}
                >
                  <Ticket size={16} />
                  <span className="text-[10px] font-black">{v.code}</span>
                  {activeVoucherCode === v.code && <Check size={14} />}
                </button>
              )) : (
                <p className="text-[10px] text-slate-400 italic p-1">No vouchers available.</p>
              )}
            </div>
          </div>

          <div className="glass p-6 rounded-[2rem] space-y-3 mb-8 border-cobalt-blue/10">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold">Rp {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-hot-pink">
                <div className="flex items-center gap-1">
                  <Ticket size={12} />
                  <span>Voucher ({activeVoucherCode})</span>
                </div>
                <span className="font-bold">-Rp {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="h-[1px] bg-theme-border w-full border-dashed my-2" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-0.5">{t.total}</p>
                <p className="text-2xl font-black text-cobalt-blue">Rp {total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-0.5">Reward Points</p>
                <p className="text-sm font-black text-hot-pink">+{pointsEarned}</p>
              </div>
            </div>
          </div>

          <Button variant="neon" onClick={() => onFinish({ subtotal, discount, total, pointsEarned, cart, activeVoucherCode })} className="h-16 text-lg">
            {t.checkout} <ChevronRight size={20} />
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
