import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, User, Mail } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { loginUser, registerUser } from '../../lib/auth';
import { Loader2 } from 'lucide-react';

export const LandingScreen = ({ onLogin, onForgotPassword, t }: any) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
      } else {
        const user = await registerUser(username, email, phone, password);
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
          <div className="text-center mt-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
              AUTO<span className="text-cobalt-blue">CASHIER</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium tracking-[0.4em] uppercase mt-0.5">LookSee Technology</p>
          </div>
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
            ) : (
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
            )}
          </AnimatePresence>
        </motion.div>

        <p className="mt-6 sm:mt-8 text-xs text-slate-500">
          {mode === 'login' ? t.noAccount : t.alreadyAccount}{" "}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-cobalt-blue font-semibold">
            {mode === 'login' ? t.register : t.login}
          </button>
        </p>
      </div>
    </motion.div>
  );
};
