import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Star, Lock, Moon, Sun, Languages, ChevronRight, LogOut, CheckCircle2, Camera, ShieldCheck, Save, Loader2, Mail, Phone } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { updateUserProfile } from '../../lib/auth';

export const ProfileScreen = ({ t, theme, toggleTheme, lang, toggleLang, onLogout }: any) => {
  const { user, updateUser, pointPercentage, setPointPercentage } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [passData, setPassData] = useState({ new: '', confirm: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [adminPointPercent, setAdminPointPercent] = useState(pointPercentage);
  const [notification, setNotification] = useState<{ message: string, type: 'success' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string) => {
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = await updateUserProfile(user.id, editData.name, editData.username, editData.avatar, editData.email);
      updateUser({ ...editData, name: updatedData.full_name, username: updatedData.username, avatar: updatedData.avatar_url || editData.avatar, email: updatedData.email });
      setIsEditing(false);
      showNotification(lang === 'ID' ? 'Profil berhasil diperbarui' : 'Profile updated successfully');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePassSave = () => {
    if (!passData.new || passData.new !== passData.confirm) return;
    setIsChangingPass(false);
    setPassData({ new: '', confirm: '' });
    showNotification(lang === 'ID' ? 'Password baru berhasil disimpan' : 'New password saved successfully');
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditData({ ...editData, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 pb-32 space-y-8 relative max-w-sm mx-auto"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

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
          onClick={() => {
            if (isEditing) handleSave();
            else {
              setEditData({ ...user });
              setIsEditing(true);
            }
          }}
          disabled={isSaving}
          className="text-xs font-bold text-cobalt-blue uppercase px-4 py-2 glass rounded-full flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
          {isSaving ? 'Menyimpan...' : (isEditing ? t.saveChanges : t.editProfile)}
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4 py-4">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cobalt-blue to-hot-pink p-1 shadow-neon overflow-hidden">
            <div className="w-full h-full rounded-full bg-theme-bg flex items-center justify-center text-3xl font-black overflow-hidden relative">
              {(isEditing ? editData.avatar : user.avatar).length <= 2 ? (
                <span>{isEditing ? editData.avatar : user.avatar}</span>
              ) : (
                <img src={isEditing ? editData.avatar : user.avatar} className="w-full h-full object-cover" alt="Avatar" />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <Camera size={20} />
                </div>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="absolute bottom-0 right-0 p-2 bg-cobalt-blue text-white rounded-full shadow-lg">
              <Camera size={14} />
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-slate-500 text-xs font-medium">@{user.username}</p>
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] font-bold text-slate-400">
              {user.email && <span className="flex items-center gap-1 bg-theme-bg-secondary px-2 py-1 rounded-md"><Mail size={10} /> {user.email}</span>}
              {user.phone && <span className="flex items-center gap-1 bg-theme-bg-secondary px-2 py-1 rounded-md"><Phone size={10} /> {user.phone}</span>}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase text-slate-500 ml-1">{t.fullName}</label>
              <Input
                icon={User}
                value={editData.name}
                onChange={(e: any) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase text-slate-500 ml-1">Email</label>
              <Input
                icon={Mail}
                type="email"
                value={editData.email || ''}
                onChange={(e: any) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase text-slate-500 ml-1">
                {lang === 'EN' ? 'WhatsApp Number' : 'Nomor WhatsApp'}
              </label>
              <Input
                icon={Phone}
                value={editData.phone || ''}
                disabled={true}
                onChange={() => { }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase text-slate-500 ml-1">{t.username}</label>
              <Input
                icon={Star}
                value={editData.username}
                onChange={(e: any) => setEditData({ ...editData, username: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4">
        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">{t.settings}</h4>

        <div className="glass rounded-[2rem] overflow-hidden border-theme-border divide-y divide-theme-border">
          {/* Theme Toggle */}
          <div className="p-5 flex items-center justify-between hover:bg-theme-bg-secondary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span className="text-sm font-medium">{t.themeLabel}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="text-[10px] font-bold text-cobalt-blue uppercase px-3 py-1 bg-cobalt-blue/5 rounded-full"
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
              <span className="text-sm font-medium">{t.langLabel}</span>
            </div>
            <button
              onClick={toggleLang}
              className="text-[10px] font-bold text-cobalt-blue uppercase px-3 py-1 bg-cobalt-blue/5 rounded-full"
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
                <span className="text-sm font-medium">{t.changePass}</span>
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
                    onChange={(e: any) => setPassData({ ...passData, new: e.target.value })}
                  />
                  <Input
                    type="password"
                    icon={Lock}
                    placeholder={t.confirmPass}
                    value={passData.confirm}
                    onChange={(e: any) => setPassData({ ...passData, confirm: e.target.value })}
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
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </motion.div>
  );
};
