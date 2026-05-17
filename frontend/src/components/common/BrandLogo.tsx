import React from 'react';
import { motion } from 'motion/react';
import { Scan } from 'lucide-react';

export const BrandLogo = ({ size = 60, animated = true }: { size?: number, animated?: boolean }) => (
  <motion.div 
    animate={animated ? { y: [0, -5, 0] } : {}}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative flex items-center justify-center"
  >
    <img src="/logo.png" alt="AutoCashier Logo" className="w-40 h-40 object-contain rounded-2xl overflow-hidden" />
  </motion.div>
);
