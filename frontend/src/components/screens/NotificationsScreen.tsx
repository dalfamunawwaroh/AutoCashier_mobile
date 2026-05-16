import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Bell, MailOpen } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { GlassCard } from '../common/GlassCard';
import { cn } from '../../lib/utils';

export const NotificationsScreen = ({ t, onBack }: any) => {
  const { notifications, markNotificationsAsRead } = useAppStore();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="safe-h-screen w-full bg-theme-bg overflow-y-auto scrollbar-hide max-w-sm mx-auto"
    >
      <div className="sticky top-0 z-30 bg-theme-bg/80 backdrop-blur-xl px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 glass rounded-2xl border border-theme-border flex items-center justify-center">
              <ChevronRight className="rotate-180" size={20} />
            </button>
            <h2 className="text-2xl font-black">{t.notifications}</h2>
          </div>
          <button 
            onClick={markNotificationsAsRead}
            className="text-[10px] font-bold text-cobalt-blue uppercase px-3 py-1 bg-cobalt-blue/5 rounded-full"
          >
            {t.markAllRead}
          </button>
        </div>
      </div>

      <div className="px-6 pb-32 space-y-4">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <GlassCard key={n.id} className={cn("p-5 relative overflow-hidden", !n.isRead && "border-cobalt-blue/30")}>
              {!n.isRead && <div className="absolute top-0 right-0 w-3 h-3 bg-hot-pink rounded-bl-xl" />}
              <div className="flex gap-4">
                <div className={cn(
                  "p-3 rounded-2xl flex items-center justify-center flex-shrink-0 h-fit",
                  n.isRead ? "bg-theme-bg-secondary text-slate-400" : "bg-cobalt-blue/10 text-cobalt-blue"
                )}>
                  {n.isRead ? <MailOpen size={18} /> : <Bell size={18} />}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <p className={cn("text-sm transition-all", n.isRead ? "font-semibold text-slate-500" : "font-black text-theme-text")}>
                      {n.title}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{n.body}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-2">{n.date}</p>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-theme-bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
               <Bell size={32} />
            </div>
            <p className="text-sm font-medium text-slate-500">{t.noNotifications}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
