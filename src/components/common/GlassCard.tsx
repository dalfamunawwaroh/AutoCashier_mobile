import React from 'react';
import { cn } from '../../lib/utils';

export const GlassCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: React.Key }) => (
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
