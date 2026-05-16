import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({ icon: Icon, placeholder, type = "text", ...props }: any) => {
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
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};
