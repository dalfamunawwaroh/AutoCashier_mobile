import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, User, Mail } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { loginUser, registerUser, verifyOtp } from '../../lib/auth';
import { Loader2 } from 'lucide-react';

export const LandingScreen = ({ onLogin, onForgotPassword, t }: any) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async () => {
    setErrorMsg('');
    if (!phone || !password || (mode === 'register' && (!username || !email))) {
      setErrorMsg('Harap isi semua kolom');
      return;
    }
    
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await loginUser(phone, password);
        onLogin(user);
      } else if (mode === 'register') {
        await registerUser(username, email, phone, password);
        setMode('otp');
      } else if (mode === 'otp') {
        if (!otp) {
          setErrorMsg('Harap masukkan kode OTP');
          return;
        }
        const user = await verifyOtp(email, otp);
        onLogin(user);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="safe-h-screen w-full flex flex-col p-6 sm:p-8 bg-theme-bg relative overflow-hidden"
    >
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cobalt-blue/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center flex-1 h-full">
        <div className="mb-4 sm:mb-8 flex flex-col items-center transform scale-75 sm:scale-100 origin-center">
          <BrandLogo size={56} />
        </div>

        <motion.div 
          layout
          className="w-full glass p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-theme-border relative z-10 space-y-4 sm:space-y-6 shadow-xl"
        >
          <div className="flex gap-4 mb-2">
            <button 
              onClick={() => setMode('login')}
              className={cn("text-lg font-black transition-all", mode === 'login' ? "text-theme-text" : "text-slate-400 text-sm")}
            >
              {t.login}
            </button>
            <button 
              onClick={() => setMode('register')}
              className={cn("text-lg font-black transition-all", mode === 'register' ? "text-theme-text" : "text-slate-400 text-sm")}
            >
              {t.register}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}
                <Input icon={Phone} placeholder={t.waPlaceholder} value={phone} onChange={(e: any) => setPhone(e.target.value)} />
                <div className="space-y-2 text-right">
                  <Input icon={Lock} placeholder="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
                  <button 
                    onClick={() => onForgotPassword()}
                    className="text-[10px] font-medium text-cobalt-blue/60 hover:text-cobalt-blue transition-colors"
                  >
                    {t.forgotPass}
                  </button>
                </div>
                <Button variant="neon" onClick={handleAuth} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t.login}
                </Button>
              </motion.div>
            ) : mode === 'register' ? (
              <motion.div 
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}
                <Input icon={User} placeholder="Username" value={username} onChange={(e: any) => setUsername(e.target.value)} />
                <Input icon={Mail} placeholder="Alamat Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
                <Input icon={Phone} placeholder="Nomor WhatsApp" value={phone} onChange={(e: any) => setPhone(e.target.value)} />
                <Input icon={Lock} placeholder="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
                <Button variant="neon" onClick={handleAuth} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t.register}
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="otp-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6 text-center py-2"
              >
                <div className="w-16 h-16 bg-cobalt-blue/10 text-cobalt-blue rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Verifikasi Email</h3>
                  <p className="text-xs text-slate-500 mt-1">Kami telah mengirim 6 angka OTP ke email <strong>{email}</strong></p>
                </div>
                {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}
                <Input icon={Lock} placeholder="Masukkan 6 Angka OTP" type="number" value={otp} onChange={(e: any) => setOtp(e.target.value)} />
                <Button variant="neon" onClick={handleAuth} disabled={loading || !otp}>
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Verifikasi Akun"}
                </Button>
                <button onClick={() => setMode('register')} className="text-xs text-slate-400 hover:text-white transition-colors">Batal</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {mode !== 'otp' && (
          <p className="mt-6 sm:mt-8 text-xs text-slate-500">
            {mode === 'login' ? t.noAccount : t.alreadyAccount}{" "}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-cobalt-blue font-semibold">
              {mode === 'login' ? t.register : t.login}
            </button>
          </p>
        )}
      </div>
    </motion.div>
  );
};
