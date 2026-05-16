import React from 'react';
import { cn } from '../../lib/utils';

export const Button = ({ 
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
        'w-full py-3 px-6 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 h-14 text-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
