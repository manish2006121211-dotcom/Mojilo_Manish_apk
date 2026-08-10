import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import { User } from '../types';

interface LoginSuccessAnimationProps {
  user: User;
}

export const LoginSuccessAnimation: React.FC<LoginSuccessAnimationProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-50 bg-[#0b1329]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center select-none"
    >
      <div className="relative max-w-sm w-full bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl flex flex-col items-center space-y-5">
        {/* Glowing Background Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-500/10 via-amber-400/10 to-transparent pointer-events-none" />

        {/* Animated Checkmark Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 18,
            delay: 0.1,
          }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 p-1 shadow-lg shadow-orange-500/30 flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-amber-400" />
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="space-y-1.5"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>લૉગિન સફળ રહ્યું!</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight pt-1">
            આપનું સ્વાગત છે, {user.name}!
          </h2>

          <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>{user.role === 'ADMIN' ? 'એડમિન લૉગિન' : 'વિદ્યાર્થી લૉગિન'} • સક્રિય સેશન</span>
          </p>
        </motion.div>

        {/* Pulse Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-300/90"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>પોર્ટલમાં પ્રવેશ થઈ રહ્યો છે...</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
