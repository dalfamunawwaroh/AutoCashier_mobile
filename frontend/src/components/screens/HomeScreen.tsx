import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Zap, Ticket, ChevronRight, Loader2 } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { VOUCHERS } from '../../constants/mockData';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const HomeScreen = ({ t, onGoToVouchers, onGoToPoints, onGoToNotifications }: any) => {
  const { user, notifications, setPoints, setUser, collectedVouchers, setCollectedVouchers } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);



  useEffect(() => {
    const fetchUserDataAndNotifications = async () => {
      try {
        setLoading(true);

        // 1. Ambil data poin & info member terbaru berdasarkan ID user yang sedang login
        if (user?.id) {
          const response = await axios.get(`${API_URL}/auth/user/${user.id}`);
          const userData = response.data;
          
          setUser({ 
            ...user, 
            name: userData.full_name, 
            avatar: userData.avatar_url || 'A', 
            username: userData.username 
          });
          setPoints(userData.points);
          
          // 2. Fetch claimed vouchers
          const claimedRes = await axios.get(`${API_URL}/promos/claimed/${user.id}`);
          setCollectedVouchers(claimedRes.data);
        }

        // Fallback hitung unread jika ada (karena di backend belum diimplementasikan notifikasi)
        setUnreadCount(notifications.filter(n => !n.isRead).length);

      } catch (error) {
        console.error('Gagal memuat data dari Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndNotifications();
  }, [user?.id]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-32 space-y-8 max-w-sm mx-auto"
    >
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">
            {t.welcome.replace('{name}', user?.name ? user.name.split(' ')[0] : 'Member')}
          </h2>
          <p className="text-xs text-slate-500 font-medium">{t.membership}</p>
        </div>
        <button 
          onClick={onGoToNotifications}
          className="p-3 glass rounded-2xl relative text-cobalt-blue border border-theme-border active:scale-90 transition-transform"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-hot-pink rounded-full shadow-[0_0_8px_#F472B6]" />
          )}
        </button>
      </div>

      {/* POINTS CARD */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={onGoToPoints}
        className="relative group overflow-hidden rounded-[2.5rem] cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt-blue to-hot-pink opacity-80" />
        <div className="relative p-8 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{t.points}</p>
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin opacity-80" />
            ) : (
              <h1 className="text-4xl font-black">
                {(user?.points || 0).toLocaleString('id-ID')}
              </h1>
            )}
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 bg-white/20 rounded-3xl backdrop-blur-md"
          >
            <Zap size={32} />
          </motion.div>
        </div>
      </motion.div>

      {/* VOUCHERS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Ticket size={14} /> {t.myVouchers}
          </h3>
          <button 
            onClick={onGoToVouchers}
            className="text-[10px] font-bold text-cobalt-blue uppercase flex items-center gap-1 hover:opacity-70 transition-opacity"
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
                     <p className="text-sm font-bold">{v.code}</p>
                     <p className="text-[10px] text-slate-500">{v.title || v.description || 'Diskon Spesial'}</p>
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