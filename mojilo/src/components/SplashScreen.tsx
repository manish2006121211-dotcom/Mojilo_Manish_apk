import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#0b1329] flex flex-col items-center justify-between py-12 px-6 text-white select-none overflow-hidden"
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400/90 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 shadow-inner"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>TET-1 શિક્ષક પાત્રતા કસોટી પોર્ટલ</span>
      </motion.div>

      {/* Center Animated Logo & Branding */}
      <div className="flex flex-col items-center text-center my-auto z-10">
        {/* Glowing Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 18,
            delay: 0.3,
          }}
          className="relative mb-6"
        >
          {/* Pulsing ring behind logo */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-[36px] bg-gradient-to-tr from-orange-500 to-amber-400 blur-md opacity-50"
          />

          <img
            src="/icon.png"
            alt="મોજીલો મનીષ"
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-[32px] object-cover shadow-2xl border-2 border-orange-400/40"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Title reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md"
        >
          મોજીલો મનીષ
        </motion.h1>

        {/* Subtitle tag */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="text-amber-300 font-extrabold text-sm sm:text-base mt-1.5 tracking-wide"
        >
          LEARN • PRACTICE • SUCCEED
        </motion.p>
      </div>

      {/* Bottom Loading Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="w-full max-w-xs space-y-3 z-10 text-center"
      >
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 rounded-full"
          />
        </div>
        <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase animate-pulse">
          એપ શરૂ થઈ રહી છે...
        </p>
      </motion.div>
    </motion.div>
  );
};
