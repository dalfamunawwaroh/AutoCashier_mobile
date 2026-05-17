/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home,
  History,
  User,
  Scan
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Store & Constants
import { useAppStore } from './hooks/useAppStore';
import { translations } from './constants/translations';

// Components
import { BrandLogo } from './components/common/BrandLogo';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { cn } from './lib/utils';
import { saveTransaction } from './lib/supabase';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { VoucherCenterScreen } from './components/screens/VoucherCenterScreen';
import { PointsHistoryScreen } from './components/screens/PointsHistoryScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ForgotPasswordScreen } from './components/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/screens/ResetPasswordScreen';
import { ScannerScreen } from './components/screens/ScannerScreen';

export default function App() {
  const { 
    isLoggedIn, 
    theme, 
    lang, 
    selectedTransaction, 
    login, 
    logout, 
    toggleTheme, 
    toggleLang, 
    setSelectedTransaction 
  } = useAppStore();

  const [screen, setScreen] = useState<'landing' | 'main' | 'scanner' | 'payment' | 'success' | 'vouchers' | 'forgot_password' | 'reset_password' | 'points_history' | 'notifications'>('landing');
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'profile'>('home');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    // Check URL for reset token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('reset');
    if (token) {
      setResetToken(token);
      setScreen('reset_password');
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check local session
    const timer = setTimeout(() => {
      setIsInitializing(false);
      if (isLoggedIn && !resetToken) setScreen('main');
    }, 1500);
    return () => clearTimeout(timer);
  }, [isLoggedIn, resetToken]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center p-8">
         <BrandLogo size={60} />
         <div className="mt-8 text-center">

           <p className="text-[10px] text-slate-500 font-medium tracking-[0.4em] uppercase">Initializing...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-cobalt-blue selection:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          screen === 'reset_password' && resetToken ? (
            <ResetPasswordScreen key="reset" token={resetToken} onFinish={() => setScreen('landing')} />
          ) : screen === 'forgot_password' ? (
            <ForgotPasswordScreen key="forgot" t={t} onBack={() => setScreen('landing')} />
          ) : (
            <LandingScreen 
              key="landing" 
              t={t} 
              onLogin={(user: any) => { 
                login({ 
                  ...user, 
                  avatar: user.avatar_url || 'A', 
                  name: user.full_name,
                  email: user.email,
                  phone: user.whatsapp
                }); 
                setScreen('main'); 
              }}  
              onForgotPassword={() => setScreen('forgot_password')}
            />
          )
        ) : (
          <div className="safe-h-screen w-full flex flex-col overflow-hidden">
            {screen === 'main' && (
              <div key="app-main" className="flex-1 relative overflow-hidden flex flex-col">
                <main className="flex-1 overflow-y-auto scrollbar-hide pt-safe pb-32">
                  <AnimatePresence mode="wait">
                    {activeTab === 'home' && (
                      <HomeScreen 
                        key="home-tab" 
                        t={t} 
                        onGoToVouchers={() => setScreen('vouchers')} 
                        onGoToPoints={() => setScreen('points_history')}
                        onGoToNotifications={() => setScreen('notifications')}
                      />
                    )}
                    {activeTab === 'history' && <HistoryScreen key="history-tab" t={t} onShowDetail={setSelectedTransaction} />}
                    {activeTab === 'profile' && (
                      <ProfileScreen 
                        key="profile-tab" 
                        t={t} 
                        theme={theme} 
                        toggleTheme={toggleTheme} 
                        lang={lang} 
                        toggleLang={toggleLang} 
                        onLogout={logout} 
                      />
                    )}
                  </AnimatePresence>
                </main>

                <nav className="p-6 pt-0 absolute bottom-0 left-0 w-full z-50 pointer-events-none">
                  <div className="glass p-2 rounded-[2rem] flex items-center justify-between border-theme-border backdrop-blur-3xl shadow-2xl pointer-events-auto max-w-sm mx-auto">
                    <button 
                      onClick={() => setActiveTab('home')}
                      className={cn("flex-1 p-3 rounded-[1.25rem] flex flex-col items-center gap-1 transition-all", activeTab === 'home' ? "bg-cobalt-blue/10 text-cobalt-blue font-semibold" : "text-slate-400")}
                    >
                      <Home size={18} />
                      <span className="text-[7px] font-bold uppercase tracking-widest">{t.home}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('history')}
                      className={cn("flex-1 p-3 rounded-[1.25rem] flex flex-col items-center gap-1 transition-all", activeTab === 'history' ? "bg-cobalt-blue/10 text-cobalt-blue font-semibold" : "text-slate-400")}
                    >
                      <History size={18} />
                      <span className="text-[7px] font-bold uppercase tracking-widest">{t.history}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={cn("flex-1 p-3 rounded-[1.25rem] flex flex-col items-center gap-1 transition-all", activeTab === 'profile' ? "bg-cobalt-blue/10 text-cobalt-blue font-semibold" : "text-slate-400")}
                    >
                      <User size={18} />
                      <span className="text-[7px] font-bold uppercase tracking-widest">{t.profile}</span>
                    </button>
                  </div>
                </nav>
              </div>
            )}

            {screen === 'scanner' && (
              <ScannerScreen 
                key="scanner" 
                t={t} 
                onBack={() => setScreen('main')} 
                onComplete={() => setIsCheckoutOpen(true)} 
              />
            )}
            {screen === 'vouchers' && <VoucherCenterScreen key="vouchers" t={t} onBack={() => setScreen('main')} />}
            {screen === 'points_history' && <PointsHistoryScreen key="points" t={t} onBack={() => setScreen('main')} />}
            {screen === 'notifications' && <NotificationsScreen key="notifications" t={t} onBack={() => setScreen('main')} />}
          </div>
        )}
      </AnimatePresence>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onFinish={async (details: any) => {
          setIsCheckoutOpen(false);
          setScreen('main');
          
          try {
            const userId = useAppStore.getState().user?.id;
            if (userId && details) {
              await saveTransaction(
                userId, 
                details.cart, 
                details.subtotal, 
                details.discount, 
                details.total, 
                details.pointsEarned, 
                details.activeVoucherCode
              );
            }
          } catch (e) {
            console.error('Failed to save transaction', e);
          }
          
          useAppStore.getState().clearCart();
        }}
        t={t} 
      />

      <TransactionDetailModal 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        t={t} 
      />
    </div>
  );
}
