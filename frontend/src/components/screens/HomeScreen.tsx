import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Zap, Ticket, Loader2 } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface HomeScreenProps {
  t: Record<string, string>;
  onGoToVouchers: () => void;
  onGoToPoints: () => void;
  onGoToNotifications: () => void;
}

export const HomeScreen = ({
  t,
  onGoToVouchers,
  onGoToPoints,
  onGoToNotifications,
}: HomeScreenProps) => {
  const { user, notifications, setPoints, setUser, collectedVouchers, setCollectedVouchers } =
    useAppStore();
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        // Refresh user profile & points
        const { data: userData } = await axios.get(`${API_URL}/auth/user/${user.id}`);
        setUser({
          ...user,
          name: userData.full_name,
          avatar: userData.avatar_url || 'A',
          username: userData.username,
          email: userData.email,
          phone: userData.whatsapp,
        });
        setPoints(userData.points);

        // Refresh claimed vouchers
        const { data: claimedVouchers } = await axios.get(
          `${API_URL}/promos/claimed/${user.id}`
        );
        setCollectedVouchers(claimedVouchers);
      } catch (error) {
        console.error('Gagal memuat data pengguna:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-32 space-y-8 max-w-sm mx-auto"
    >
      {/* Header */}
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

      {/* Points card */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onGoToPoints}
        className="relative group overflow-hidden rounded-[2.5rem] cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt-blue to-hot-pink opacity-80" />
        <div className="relative p-8 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
              {t.points}
            </p>
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

      {/* Claimed vouchers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Ticket size={14} /> {t.myVouchers}
          </h3>
        </div>

        <div className="space-y-3">
          {collectedVouchers.length > 0 ? (
            collectedVouchers.map((v) => (
              <div
                key={v.code}
                className="p-4 glass rounded-2xl flex items-center justify-between border-dashed border-cobalt-blue/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cobalt-blue/10 text-cobalt-blue rounded-xl">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{v.code}</p>
                    <p className="text-[10px] text-slate-500">
                      {v.title || v.description || 'Diskon Spesial'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 glass rounded-3xl border-dashed border-theme-border text-center">
              <p className="text-xs text-slate-500 font-medium italic">
                {t.noVouchersClaimed}
              </p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};
