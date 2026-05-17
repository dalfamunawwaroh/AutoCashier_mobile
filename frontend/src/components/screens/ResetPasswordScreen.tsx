import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { confirmResetPassword } from '../../lib/auth';

export const ResetPasswordScreen = ({ token, onFinish }: { token: string, onFinish: () => void }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMsg('Harap isi semua kolom');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Password tidak cocok');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await confirmResetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="safe-min-h-screen bg-theme-bg p-6 flex flex-col items-center justify-center relative"
      >
        <div className="w-full max-w-sm glass p-8 rounded-[2.5rem] border-theme-border shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black mb-2">Password Diubah!</h2>
          <p className="text-sm font-medium text-slate-500 mb-8">Silakan login kembali menggunakan password baru Anda.</p>
          <Button variant="neon" onClick={onFinish}>Kembali ke Login</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="safe-min-h-screen bg-theme-bg p-6 flex flex-col items-center justify-center relative"
    >
      <div className="w-full max-w-sm glass p-8 rounded-[2.5rem] border-theme-border shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-2">Buat Password Baru</h2>
          <p className="text-xs text-slate-500 font-medium">Masukkan password baru untuk akun Anda.</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}
          <Input 
            icon={Lock} 
            placeholder="Password Baru" 
            type="password"
            value={newPassword}
            onChange={(e: any) => setNewPassword(e.target.value)}
          />
          <Input 
            icon={Lock} 
            placeholder="Konfirmasi Password Baru" 
            type="password"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button variant="neon" onClick={handleReset} disabled={loading || !newPassword || !confirmPassword}>
          {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Simpan Password"}
        </Button>
      </div>
    </motion.div>
  );
};
