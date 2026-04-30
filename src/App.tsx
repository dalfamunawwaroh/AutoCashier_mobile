/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Languages,
  LogOut,
  Package,
  Zap,
  Scan,
  ShieldCheck,
  Phone,
  Trash2,
  ChevronRight,
  Home,
  History,
  User,
  Bell,
  Ticket,
  X,
  CreditCard,
  QrCode,
  AlertTriangle,
  Settings,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Star,
  Info,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { create } from 'zustand';

// --- Global State Management (Zustand) ---

interface AppState {
  isLoggedIn: boolean;
  theme: 'dark' | 'light';
  lang: 'ID' | 'EN';
  selectedTransaction: any | null;
  collectedVoucherCodes: string[];
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  setSelectedTransaction: (tx: any | null) => void;
  claimVoucher: (code: string) => void;
  updateUser: (data: Partial<AppState['user']>) => void;
}

const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  theme: 'dark',
  lang: 'ID',
  selectedTransaction: null,
  collectedVoucherCodes: ['GIATHEMAT'],
  user: {
    name: 'Afa User',
    username: 'afa_jagoan',
    avatar: 'A',
  },
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleLang: () => set((state) => ({ lang: state.lang === 'ID' ? 'EN' : 'ID' })),
  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
  claimVoucher: (code) => set((state) => ({
    collectedVoucherCodes: state.collectedVoucherCodes.includes(code)
      ? state.collectedVoucherCodes
      : [...state.collectedVoucherCodes, code]
  })),
  updateUser: (data) => set((state) => ({
    user: { ...state.user, ...data }
  })),
}));

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mobile Buyer Translations ---

const translations: Record<string, any> = {
  ID: {
    login: "Masuk",
    register: "Daftar",
    waPlaceholder: "Nomor WhatsApp",
    pinPlaceholder: "PIN/Password",
    namePlaceholder: "Nama Lengkap",
    scanNow: "Scan",
    welcome: "Halo, {name}! 👋",
    points: "Poin Kamu",
    vouchers: "Voucher Member",
    history: "Riwayat",
    settings: "Profil",
    profile: "Profil",
    home: "Beranda",
    scanROI: "Arahkan Kamera ke Barang",
    locking: "MENGUNCI...",
    cart: "Keranjang",
    checkout: "Bayar Sekarang",
    paymentTitle: "Pembayaran QRIS",
    paymentNote: "Arahkan kamera ke layar validasi setelah bayar",
    successTitle: "Belanja Berhasil!",
    pointsEarned: "Kamu dapet {points} Poin!",
    autoClose: "Kembali ke Beranda dalam 3 detik...",
    voucherApplied: "Voucher Berhasil Dipasang",
    langLabel: "Bahasa",
    themeLabel: "Tema",
    themeDark: "Gelap",
    themeLight: "Terang",
    items: "Item",
    total: "Total Bayar",
    detailTitle: "Detail Transaksi",
    invoice: "No. Invoice",
    date: "Tanggal",
    paymentMethod: "Metode Pembayaran",
    status: "Status",
    statusSuccess: "Berhasil",
    specialPromo: "Spesial Untuk Kamu",
    membership: "JagoAI Member Plus",
    notLoggedIn: "Belum login? ",
    alreadyAccount: "Sudah punya akun?",
    noAccount: "Belum punya akun?",
    voucherCenter: "Pusat Voucher",
    collectVoucher: "Ambil Voucher Baru",
    myVouchers: "Voucher Saya",
    claim: "Ambil",
    claimed: "Tersimpan",
    editProfile: "Edit Profil",
    saveChanges: "Simpan Perubahan",
    username: "Username",
    fullName: "Nama Lengkap",
    changePass: "Ubah Password",
    newPass: "Password Baru",
    confirmPass: "Konfirmasi Password",
    forgotPass: "Lupa Password?",
    resetPass: "Reset Password"
  },
  EN: {
    login: "Login",
    register: "Register",
    waPlaceholder: "WhatsApp Number",
    pinPlaceholder: "PIN/Password",
    namePlaceholder: "Full Name",
    scanNow: "Scan",
    welcome: "Hello, {name}! 👋",
    points: "Your Points",
    vouchers: "Member Vouchers",
    history: "History",
    settings: "Profile",
    profile: "Profile",
    home: "Home",
    scanROI: "Point Camera at Item",
    locking: "LOCKING...",
    cart: "Cart",
    checkout: "Checkout Now",
    paymentTitle: "QRIS Payment",
    paymentNote: "Point camera at validation screen after paying",
    successTitle: "Shopping Success!",
    pointsEarned: "You earned {points} Points!",
    autoClose: "Back to Home in 3 seconds...",
    voucherApplied: "Voucher Applied Successfully",
    langLabel: "Language",
    themeLabel: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    items: "Items",
    total: "Total Payment",
    detailTitle: "Transaction Detail",
    invoice: "Invoice No.",
    date: "Date",
    paymentMethod: "Payment Method",
    status: "Status",
    statusSuccess: "Success",
    specialPromo: "Special For You",
    membership: "JagoAI Member Plus",
    notLoggedIn: "Not logged in? ",
    alreadyAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    voucherCenter: "Voucher Center",
    collectVoucher: "Collect New Vouchers",
    myVouchers: "My Vouchers",
    claim: "Claim",
    claimed: "Claimed",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    username: "Username",
    fullName: "Full Name",
    changePass: "Change Password",
    newPass: "New Password",
    confirmPass: "Confirm Password",
    forgotPass: "Forgot Password?",
    resetPass: "Reset Password"
  }
};

// --- Mock Data ---
const PRODUCTS = [
  { id: '1', name: 'Ultra Milk Chocolate 250ml', price: 6500 },
  { id: '2', name: 'Indomie Goreng Original', price: 3500 },
  { id: '3', name: 'Aqua Mineral 600ml', price: 4000 },
  { id: '4', name: 'Silverqueen Almond 65g', price: 15500 },
];

const VOUCHERS = [
  { code: 'GIATHEMAT', discount: 2000, desc: 'Potongan Rp 2.000' },
  { code: 'JAGOAI5K', discount: 5000, desc: 'Potongan Rp 5.000' },
];

const TRANSACTION_HISTORY = [
  { id: 'TX001', date: '20 Apr 2026', total: 25500, points: 25, status: 'Success', items: [
    { name: 'Indomie Goreng', qty: 2, price: 3500 },
    { name: 'Ultra Milk', qty: 1, price: 6500 },
    { name: 'Silverqueen', qty: 1, price: 12000 },
  ], method: 'QRIS' },
  { id: 'TX002', date: '18 Apr 2026', total: 12000, points: 12, status: 'Success', items: [
    { name: 'Aqua Mineral', qty: 3, price: 4000 },
  ], method: 'QRIS' },
  { id: 'TX003', date: '15 Apr 2026', total: 45000, points: 45, status: 'Success', items: [
    { name: 'Items Mixed Pack', qty: 1, price: 45000 },
  ], method: 'Cash' },
];

// --- Components ---

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: React.Key }) => (
  <div 
    onClick={onClick}
    className={cn(
      "glass-element border border-theme-border rounded-[1.5rem] overflow-hidden shadow-sm",
      onClick && "active:scale-[0.98] transition-transform duration-200 cursor-pointer",
      className
    )}
  >
    {children}
  </div>
);

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'neon' }) => {
  const variants = {
    primary: 'bg-cobalt-blue text-white shadow-sm active:scale-95',
    neon: 'bg-cobalt-blue text-white shadow-[0_0_15px_rgba(0,71,255,0.3)] active:scale-95',
    outline: 'border-2 border-cobalt-blue text-cobalt-blue bg-transparent',
    ghost: 'text-slate-400 hover:text-theme-text',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20'
  };

  return (
    <button 
      className={cn(
        'w-full py-3 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 h-14 text-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ icon: Icon, placeholder, type = "text", ...props }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cobalt-blue transition-colors">
        <Icon size={18} />
      </div>
      <input 
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        className="w-full h-14 bg-theme-bg-secondary border border-theme-border rounded-2xl pl-14 pr-12 text-sm font-medium focus:outline-none focus:border-cobalt-blue transition-all"
        {...props}
      />
      {isPassword && (
        <button 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

// --- Modals ---

const TransactionDetailModal = ({ transaction, onClose, t }: any) => {
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
              <div className="font-bold">{transaction.id}</div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="text-slate-500">{t.date}</div>
              <div className="font-bold">{transaction.date}</div>
            </div>

            <div className="h-[1px] bg-theme-border w-full" />

            <div className="space-y-3">
              {transaction.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold">{item.qty}x</span> {item.name}
                  </div>
                  <div className="font-medium">Rp {(item.qty * item.price).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-theme-border w-full border-dashed" />

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <div className="text-slate-500">{t.paymentMethod}</div>
                <div className="font-bold">{transaction.method}</div>
              </div>
              <div className="flex justify-between text-xs">
                <div className="text-slate-500">{t.status}</div>
                <div className="text-green-500 font-black">{t.statusSuccess}</div>
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

// --- Screens ---

const BrandLogo = ({ size = 60, animated = true }: { size?: number, animated?: boolean }) => (
  <div className="relative flex items-center justify-center p-12">
    {/* Background Glow */}
    <motion.div 
      animate={animated ? { 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      } : {}}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute inset-0 bg-cobalt-blue/10 blur-3xl rounded-full"
    />
    
    {/* Outer Rotating Ring */}
    <motion.div 
      animate={animated ? { rotate: 360 } : {}}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute inset-4 border border-dashed border-cobalt-blue/30 rounded-[3rem]"
    />

    {/* Main Icon Container */}
    <motion.div 
      animate={animated ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="p-8 glass rounded-[2.5rem] border-theme-border relative z-10 shadow-2xl"
    >
      <div className="relative">
        <Scan size={size} className="text-cobalt-blue" />
        
        {/* Animated Scanning Laser */}
        {animated && (
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-10%] right-[-10%] h-[2px] bg-gradient-to-r from-transparent via-hot-pink to-transparent shadow-[0_0_12px_rgba(244,114,182,0.8)] z-20"
          />
        )}

        {/* Corner Accents */}
        <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-cobalt-blue/50 rounded-tl-md" />
        <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-cobalt-blue/50 rounded-tr-md" />
        <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-cobalt-blue/50 rounded-bl-md" />
        <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-cobalt-blue/50 rounded-br-md" />
      </div>
    </motion.div>

    {/* Orbiting Particles */}
    {animated && [0, 120, 240].map((angle, i) => (
      <motion.div
        key={i}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ rotate: angle }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div 
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity }}
          className="w-2 h-2 bg-hot-pink rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#F472B6]" 
        />
      </motion.div>
    ))}
  </div>
);

const LandingScreen = ({ onLogin, onRegister, onForgotPassword, t }: any) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col p-8 bg-theme-bg overflow-y-auto scrollbar-hide relative pb-20"
    >
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cobalt-blue/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-start pt-4 sm:pt-12">
        <div className="mb-6 flex flex-col items-center transform scale-90 sm:scale-100 origin-center">
          <BrandLogo size={56} />
          <div className="text-center mt-0">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
              AUTO<span className="text-cobalt-blue">CASHIER</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase mt-0.5">LookSee Technology</p>
          </div>
        </div>

        <motion.div 
          layout
          className="w-full glass p-8 rounded-[2.5rem] border-theme-border relative z-10 space-y-6 shadow-xl"
        >
          <div className="flex gap-4 mb-4">
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
                <Input icon={Phone} placeholder={t.waPlaceholder} />
                <div className="space-y-2 text-right">
                  <Input icon={Lock} placeholder={t.pinPlaceholder} type="password" />
                  <button 
                    onClick={() => onForgotPassword()}
                    className="text-[10px] font-bold text-cobalt-blue/60 hover:text-cobalt-blue transition-colors"
                  >
                    {t.forgotPass}
                  </button>
                </div>
                <Button variant="neon" onClick={onLogin}>{t.login}</Button>
              </motion.div>
            ) : (
              <motion.div 
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input icon={User} placeholder={t.namePlaceholder} />
                <Input icon={Phone} placeholder={t.waPlaceholder} />
                <Input icon={Lock} placeholder={t.pinPlaceholder} type="password" />
                <Button variant="neon" onClick={onRegister}>{t.register}</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="mt-8 text-xs text-slate-500">
          {mode === 'login' ? t.noAccount : t.alreadyAccount}{" "}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-cobalt-blue font-bold">
            {mode === 'login' ? t.register : t.login}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

const HomeScreen = ({ t, onGoToVouchers }: any) => {
  const { collectedVoucherCodes, user } = useAppStore();
  const collectedVouchers = VOUCHERS.filter(v => collectedVoucherCodes.includes(v.code));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-32 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">{t.welcome.replace('{name}', user.name.split(' ')[0])}</h2>
          <p className="text-xs text-slate-500 font-medium">{t.membership}</p>
        </div>
        <button className="p-3 glass rounded-2xl relative text-cobalt-blue">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-hot-pink rounded-full" />
        </button>
      </div>

      <div className="relative group overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt-blue to-hot-pink opacity-80" />
        <div className="relative p-8 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{t.points}</p>
            <h1 className="text-4xl font-black">1.250</h1>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 bg-white/20 rounded-3xl backdrop-blur-md"
          >
            <Zap size={32} />
          </motion.div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Ticket size={14} /> {t.myVouchers}
          </h3>
          <button 
            onClick={onGoToVouchers}
            className="text-[10px] font-black text-cobalt-blue uppercase flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            {t.claim} <ChevronRight size={12} />
          </button>
        </div>
        
        <div className="space-y-3">
          {collectedVouchers.length > 0 ? (
            collectedVouchers.map(v => (
              <div key={v.code} className="p-4 glass rounded-2xl flex items-center justify-between border-dashed border-cobalt-blue/30">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-cobalt-blue/10 text-cobalt-blue rounded-xl">
                     <Ticket size={18} />
                   </div>
                   <div>
                     <p className="text-sm font-black">{v.code}</p>
                     <p className="text-[10px] text-slate-500">{v.desc}</p>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 glass rounded-3xl border-dashed border-theme-border text-center">
              <p className="text-xs text-slate-500 font-medium italic">Belum ada voucher yang diambil.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

const VoucherCenterScreen = ({ t, onBack }: any) => {
  const { collectedVoucherCodes, claimVoucher } = useAppStore();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-theme-bg p-6 pb-32 space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 glass rounded-2xl"><ChevronRight className="rotate-180" /></button>
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
                  <p className="text-sm font-black">{v.code}</p>
                  <p className="text-xs text-slate-500 font-bold mb-1">{v.desc}</p>
                  <p className="text-[10px] text-cobalt-blue font-black uppercase tracking-tighter">Berlaku s/d 2026</p>
                </div>
              </div>
              <button 
                onClick={() => !isCollected && claimVoucher(v.code)}
                disabled={isCollected}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300",
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
             <p className="text-xs font-bold text-theme-text mb-1">Cara Menggunakan</p>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               Voucher yang telah diambil akan otomatis muncul di halaman pembayaran saat Anda melakukan checkout di terminal.
             </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const HistoryScreen = ({ t, onShowDetail }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="p-6 pb-32 space-y-6"
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
              <p className="font-bold text-sm">{tx.id}</p>
              <p className="text-[10px] text-slate-500">{tx.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-sm">Rp {tx.total.toLocaleString()}</p>
            <p className="text-[10px] text-green-500 font-bold">Success</p>
          </div>
        </GlassCard>
      ))}
    </div>
  </motion.div>
);

const ProfileScreen = ({ t, theme, toggleTheme, lang, toggleLang, onLogout }: any) => {
  const { user, updateUser } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [passData, setPassData] = useState({ new: '', confirm: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' } | null>(null);

  const showNotification = (message: string) => {
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
    showNotification(lang === 'ID' ? 'Profil berhasil diperbarui' : 'Profile updated successfully');
  };

  const handlePassSave = () => {
    if (!passData.new || passData.new !== passData.confirm) return;
    setIsChangingPass(false);
    setPassData({ new: '', confirm: '' });
    showNotification(lang === 'ID' ? 'Password baru berhasil disimpan' : 'New password saved successfully');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 pb-32 space-y-8 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-6 left-6 right-6 z-[110] flex justify-center pointer-events-none"
          >
            <div className="glass px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border-cobalt-blue/20 bg-cobalt-blue/5">
              <div className="w-6 h-6 bg-cobalt-blue text-white rounded-full flex items-center justify-center">
                <CheckCircle2 size={14} />
              </div>
              <span className="text-xs font-black text-theme-text">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">{t.profile}</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-black text-cobalt-blue uppercase px-4 py-2 glass rounded-full"
        >
          {isEditing ? t.saveChanges : t.editProfile}
        </button>
      </div>
      
      <div className="flex flex-col items-center space-y-4 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cobalt-blue to-hot-pink p-1 shadow-neon">
            <div className="w-full h-full rounded-full bg-theme-bg flex items-center justify-center text-3xl font-black overflow-hidden">
              {user.avatar.length === 1 ? user.avatar : <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />}
            </div>
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 p-2 bg-cobalt-blue text-white rounded-full shadow-lg">
              <Star size={14} />
            </button>
          )}
        </div>
        
        {!isEditing ? (
          <div className="text-center">
            <h3 className="text-lg font-bold">{user.name}</h3>
            <p className="text-slate-500 text-xs font-medium">@{user.username}</p>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.fullName}</label>
              <Input 
                icon={User} 
                value={editData.name} 
                onChange={(e: any) => setEditData({...editData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.username}</label>
              <Input 
                icon={Star} 
                value={editData.username} 
                onChange={(e: any) => setEditData({...editData, username: e.target.value})} 
              />
            </div>
            <Button variant="neon" onClick={handleSave} className="h-12 text-xs">{t.saveChanges}</Button>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.settings}</h4>
        
        <div className="glass rounded-[2rem] overflow-hidden border-theme-border divide-y divide-theme-border">
          {/* Theme Toggle */}
          <div className="p-5 flex items-center justify-between hover:bg-theme-bg-secondary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span className="text-sm font-bold">{t.themeLabel}</span>
            </div>
            <button 
              onClick={toggleTheme}
              className="text-[10px] font-black text-cobalt-blue uppercase px-3 py-1 bg-cobalt-blue/5 rounded-full"
            >
              {theme === 'dark' ? t.themeDark : t.themeLight}
            </button>
          </div>

          {/* Language Toggle */}
          <div className="p-5 flex items-center justify-between hover:bg-theme-bg-secondary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-hot-pink/10 text-hot-pink rounded-xl">
                <Languages size={18} />
              </div>
              <span className="text-sm font-bold">{t.langLabel}</span>
            </div>
            <button 
              onClick={toggleLang}
              className="text-[10px] font-black text-cobalt-blue uppercase px-3 py-1 bg-cobalt-blue/5 rounded-full"
            >
              {lang}
            </button>
          </div>

          {/* Password Section */}
          <div className="p-5 space-y-4">
            <button 
              onClick={() => setIsChangingPass(!isChangingPass)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cobalt-blue/10 text-cobalt-blue rounded-xl">
                  <Lock size={18} />
                </div>
                <span className="text-sm font-bold">{t.changePass}</span>
              </div>
              <ChevronRight size={16} className={cn("text-slate-400 transition-transform", isChangingPass && "rotate-90")} />
            </button>

            <AnimatePresence>
              {isChangingPass && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden pt-2"
                >
                  <Input 
                    type="password" 
                    icon={Lock} 
                    placeholder={t.newPass} 
                    value={passData.new}
                    onChange={(e: any) => setPassData({...passData, new: e.target.value})}
                  />
                  <Input 
                    type="password" 
                    icon={Lock} 
                    placeholder={t.confirmPass} 
                    value={passData.confirm}
                    onChange={(e: any) => setPassData({...passData, confirm: e.target.value})}
                  />
                  <Button 
                    variant="outline" 
                    className="h-10 text-xs"
                    onClick={handlePassSave}
                    disabled={!passData.new || passData.new !== passData.confirm}
                  >
                    {t.saveChanges}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button onClick={onLogout} className="w-full p-5 glass rounded-2xl border-red-500/10 flex items-center gap-4 text-red-500 mt-6 active:scale-95 transition-all">
          <div className="p-2 bg-red-100 flex items-center justify-center rounded-xl">
            <LogOut size={18} />
          </div>
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>

      <div className="text-center py-8">
         <p className="text-[10px] text-slate-500 font-bold opacity-30 uppercase tracking-[0.4em]">LookSee V2.1.0</p>
      </div>
    </motion.div>
  );
};

const ForgotPasswordScreen = ({ t, onBack }: any) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="min-h-screen bg-theme-bg p-8 flex flex-col items-center justify-start pt-12 sm:justify-center relative overflow-y-auto scrollbar-hide pb-20"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cobalt-blue/5 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        layout
        className="w-full max-w-md glass p-8 rounded-[2.5rem] border-theme-border shadow-2xl relative z-10"
      >
        <button onClick={onBack} className="p-3 glass rounded-2xl mb-8 flex items-center gap-2 text-xs font-bold text-slate-500">
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
              <p className="text-sm font-bold text-theme-text px-4">Buka WhatsApp kamu dan ikuti instruksi yang kami kirimkan.</p>
              <Button variant="outline" onClick={onBack}>Kembali ke Login</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ScannerScreen = ({ onBack, onComplete, t }: any) => {
  const [isLocking, setIsLocking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied:", err));
    }
  }, []);

  const simulateScan = () => {
    if (isLocking) return;
    setIsLocking(true);
    setProgress(0);

    const intv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intv);
          setIsLocking(false);
          setCartCount(c => c + 1);
          return 100;
        }
        return p + 5;
      });
    }, 50);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full bg-black relative"
    >
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-8 left-8 flex items-center gap-3">
         <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
            <Info size={16} className="text-white" />
         </div>
         <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{t.scanROI}</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="relative aspect-square w-full max-w-[280px]">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cobalt-blue rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cobalt-blue rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cobalt-blue rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cobalt-blue rounded-br-lg" />

          <AnimatePresence>
            {isLocking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center flex-col"
              >
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-white/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <motion.circle 
                      className="text-cobalt-blue" 
                      strokeWidth="6" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * progress) / 100}
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" cx="50" cy="50" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-cobalt-blue font-black mt-3 text-[10px] tracking-widest">{t.locking}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!isLocking && <button onClick={simulateScan} className="absolute inset-0 z-10" />}
        </div>
      </div>

      <div className="absolute bottom-12 px-8 w-full flex justify-between items-center z-20">
        <button onClick={onBack} className="p-4 glass rounded-full text-white"><X size={20} /></button>
        <button 
          onClick={onComplete}
          className="relative p-6 glass rounded-full text-cobalt-blue bg-cobalt-blue/10 border-cobalt-blue/30"
        >
          <ShoppingCart size={32} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-7 h-7 bg-hot-pink text-white rounded-full flex items-center justify-center font-black text-xs">{cartCount}</span>}
        </button>
      </div>
    </motion.div>
  );
};

// --- Main App Logic ---

export default function App() {
  const { isLoggedIn, theme, lang, selectedTransaction, login, logout, toggleTheme, toggleLang, setSelectedTransaction } = useAppStore();
  const [screen, setScreen] = useState<'landing' | 'main' | 'scanner' | 'payment' | 'success' | 'vouchers' | 'forgot_password'>('landing');
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'profile'>('home');
  const [isInitializing, setIsInitializing] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check local session
    setTimeout(() => {
      setIsInitializing(false);
      if (isLoggedIn) setScreen('main');
    }, 1500);
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center p-8">
         <BrandLogo size={60} />
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="mt-8 text-center"
         >
           <h2 className="text-xl font-black tracking-tighter mb-1">
             AUTO<span className="text-cobalt-blue">CASHIER</span>
           </h2>
           <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase">Initializing...</p>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-cobalt-blue selection:text-white">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          screen === 'forgot_password' ? (
            <ForgotPasswordScreen key="forgot" t={t} onBack={() => setScreen('landing')} />
          ) : (
            <LandingScreen 
              key="landing" 
              t={t} 
              onLogin={() => { login(); setScreen('main'); }} 
              onRegister={() => { login(); setScreen('main'); }} 
              onForgotPassword={() => setScreen('forgot_password')}
            />
          )
        ) : (
          <>
            {screen === 'main' && (
              <div key="app-main" className="h-screen w-full relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 'home' && <HomeScreen key="home-tab" t={t} onGoToVouchers={() => setScreen('vouchers')} />}
                    {activeTab === 'history' && <HistoryScreen key="history-tab" t={t} onShowDetail={setSelectedTransaction} />}
                    {activeTab === 'profile' && <ProfileScreen key="profile-tab" t={t} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} onLogout={logout} />}
                  </AnimatePresence>
                </div>

                <div className="p-6 pt-0 absolute bottom-0 left-0 w-full z-50">
                  <div className="glass p-2 rounded-[2.5rem] flex items-center justify-between border-theme-border backdrop-blur-3xl shadow-xl">
                    <button 
                      onClick={() => setActiveTab('home')}
                      className={cn("flex-1 p-4 rounded-[1.5rem] flex flex-col items-center gap-1 transition-all", activeTab === 'home' ? "bg-cobalt-blue/10 text-cobalt-blue" : "text-slate-400")}
                    >
                      <Home size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest">{t.home}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('history')}
                      className={cn("flex-1 p-4 rounded-[1.5rem] flex flex-col items-center gap-1 transition-all", activeTab === 'history' ? "bg-cobalt-blue/10 text-cobalt-blue" : "text-slate-400")}
                    >
                      <History size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest">{t.history}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={cn("flex-1 p-4 rounded-[1.5rem] flex flex-col items-center gap-1 transition-all", activeTab === 'profile' ? "bg-cobalt-blue/10 text-cobalt-blue" : "text-slate-400")}
                    >
                      <User size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest">{t.profile}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {screen === 'scanner' && <ScannerScreen key="scanner" t={t} onBack={() => setScreen('main')} onComplete={() => setScreen('main')} />}
            {screen === 'vouchers' && <VoucherCenterScreen key="vouchers" t={t} onBack={() => setScreen('main')} />}
          </>
        )}
      </AnimatePresence>

      <TransactionDetailModal 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        t={t} 
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        :root {
          --cobalt-blue: #0047FF;
          --hot-pink: #F472B6;
        }

        [data-theme='dark'] {
          --theme-bg: #020617;
          --theme-bg-secondary: rgba(255, 255, 255, 0.05);
          --theme-text: #FFFFFF;
          --theme-border: rgba(255, 255, 255, 0.1);
          --glass: rgba(255, 255, 255, 0.05);
        }

        [data-theme='light'] {
          --theme-bg: #FFFFFF;
          --theme-bg-secondary: #F8FAFC;
          --theme-text: #020617;
          --theme-border: #E2E8F0;
          --glass: rgba(0, 0, 0, 0.02);
        }

        body {
          font-family: 'Inter', sans-serif;
          background: var(--theme-bg);
          color: var(--theme-text);
          overscroll-behavior: none;
        }

        .glass {
          background: var(--glass);
          backdrop-filter: blur(15px);
          border: 1px solid var(--theme-border);
        }

        .glass-modal {
          background: var(--theme-bg);
          border: 1px solid var(--theme-border);
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
        }

        .glass-blue {
          background: rgba(0, 71, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 71, 255, 0.2);
        }

        .shadow-neon {
          box-shadow: 0 0 20px rgba(0, 71, 255, 0.3);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        input {
          font-size: 16px !important;
          color: var(--theme-text);
        }

        h1, h2, h3, h4 {
           letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
}
