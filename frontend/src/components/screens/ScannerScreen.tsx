import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Info } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useProducts } from '../../hooks/useProducts';

export const ScannerScreen = ({ onBack, onComplete, t }: any) => {
  const { cart, addToCart } = useAppStore();
  const { products } = useProducts();
  const [isLocking, setIsLocking] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied:", err));
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const simulateScan = () => {
    if (isLocking) return;
    setIsLocking(true);
    setProgress(0);

    const intv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intv);
          setIsLocking(false);
          if (products.length > 0) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            addToCart({ ...randomProduct, price: Number(randomProduct.price) });
          }
          return 100;
        }
        return p + 5;
      });
    }, 50);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full bg-black relative"
    >
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-8 left-8 flex items-center gap-3">
         <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
            <Info size={16} className="text-white" />
         </div>
         <p className="text-[10px] text-white/70 font-medium uppercase tracking-widest">{t.scanROI}</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="relative aspect-square w-full max-w-[280px]">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cobalt-blue rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cobalt-blue rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cobalt-blue rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cobalt-blue rounded-br-lg" />

          <AnimatePresence>
            {isLocking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center flex-col"
              >
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-white/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <motion.circle 
                      className="text-cobalt-blue" 
                      strokeWidth="6" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * progress) / 100}
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" cx="50" cy="50" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-cobalt-blue font-bold mt-3 text-[10px] tracking-widest">{t.locking}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!isLocking && <button onClick={simulateScan} className="absolute inset-0 z-10" aria-label="Simulate Scan" />}
        </div>
      </div>

      <div className="absolute bottom-12 px-8 w-full flex justify-between items-center z-20">
        <button onClick={onBack} className="p-4 glass rounded-full text-white border border-white/20 flex items-center justify-center"><X size={20} /></button>
        <button 
          onClick={onComplete}
          className="relative p-6 glass rounded-full text-cobalt-blue bg-cobalt-blue/10 border-cobalt-blue/30 flex items-center justify-center"
        >
          <ShoppingCart size={32} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-7 h-7 bg-hot-pink text-white rounded-full flex items-center justify-center font-bold text-xs">{cartCount}</span>}
        </button>
      </div>
    </motion.div>
  );
};
