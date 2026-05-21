import React from 'react';
import { motion } from 'motion/react';

interface BrandLogoProps {
  /** Icon size in pixels (unused — kept for API compatibility) */
  size?: number;
  animated?: boolean;
}

export const BrandLogo = ({ animated = true }: BrandLogoProps) => (
  <motion.div
    animate={animated ? { y: [0, -5, 0] } : {}}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    className="relative flex items-center justify-center"
  >
    <img
      src="/logo.png"
      alt="AutoCashier Logo"
      className="w-40 h-40 object-contain rounded-2xl overflow-hidden"
    />
  </motion.div>
);
