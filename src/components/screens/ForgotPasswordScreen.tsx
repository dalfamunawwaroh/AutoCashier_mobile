import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Phone, CheckCircle2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const ForgotPasswordScreen = ({ t, onBack }: any) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="safe-min-h-screen bg-theme-bg p-6 sm:p-8 flex flex-col items-center justify-center relative scrollbar-hide pb-10"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cobalt-blue/5 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        layout
        className="w-full max-w-sm glass p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-theme-border shadow-2xl relative z-10"
      >
        <button onClick={onBack} className="p-3 glass rounded-2xl mb-8 flex items-center gap-2 text-xs font-medium text-slate-500 border border-theme-border">
          <ChevronRight className="rotate-180" size={16} /> Kembali
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-black mb-2">{t.forgotPass}</h2>
          <p className="text-xs text-slate-500 font-medium">
            {step === 1 ? "Masukkan nomor WhatsApp terdaftar untuk mereset password kamu." : "Link reset password telah dikirimkan ke WhatsApp kamu."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <Input 
                icon={Phone} 
                placeholder={t.waPlaceholder} 
                value={phone}
                onChange={(e: any) => setPhone(e.target.value)}
              />
              <Button variant="neon" onClick={() => setStep(2)}>Minta Link Reset</Button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-center py-4"
            >
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <p className="text-sm font-semibold text-theme-text px-4">Buka WhatsApp kamu dan ikuti instruksi yang kami kirimkan.</p>
              <Button variant="outline" onClick={onBack}>Kembali ke Login</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
