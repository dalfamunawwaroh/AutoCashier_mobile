import React from 'react';
import { motion } from 'motion/react';
import { Scan } from 'lucide-react';

export const BrandLogo = ({ size = 60, animated = true }: { size?: number, animated?: boolean }) => (
  <div className="relative flex items-center justify-center p-12">
    {/* Background Glow */}
    <motion.div 
      animate={animated ? { 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      } : {}}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute inset-0 bg-cobalt-blue/10 blur-3xl rounded-full"
    />
    
    {/* Outer Rotating Ring */}
    <motion.div 
      animate={animated ? { rotate: 360 } : {}}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute inset-4 border border-dashed border-cobalt-blue/30 rounded-[3rem]"
    />

    {/* Main Icon Container */}
    <motion.div 
      animate={animated ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="p-8 glass rounded-[2.5rem] border-theme-border relative z-10 shadow-2xl"
    >
      <div className="relative">
        <Scan size={size} className="text-cobalt-blue" />
        
        {/* Animated Scanning Laser */}
        {animated && (
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-10%] right-[-10%] h-[2px] bg-gradient-to-r from-transparent via-hot-pink to-transparent shadow-[0_0_12px_rgba(244,114,182,0.8)] z-20"
          />
        )}

        {/* Corner Accents */}
        <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-cobalt-blue/50 rounded-tl-md" />
        <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-cobalt-blue/50 rounded-tr-md" />
        <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-cobalt-blue/50 rounded-bl-md" />
        <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-cobalt-blue/50 rounded-br-md" />
      </div>
    </motion.div>

    {/* Orbiting Particles */}
    {animated && [0, 120, 240].map((angle, i) => (
      <motion.div
        key={i}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ rotate: angle }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div 
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity }}
          className="w-2 h-2 bg-hot-pink rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#F472B6]" 
        />
      </motion.div>
    ))}
  </div>
);
