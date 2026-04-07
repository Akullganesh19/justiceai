import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Zap } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-void flex items-center justify-center z-[200]">
      {/* STATUTORY_BACKGROUND_GRID */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="flex flex-col items-center gap-10 relative z-10">
        {/* Animated Scale Icon */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-24 h-24 rounded-sm bg-void border-2 border-gold/40 flex items-center justify-center shadow-hard"
          >
            <Scale className="w-12 h-12 text-gold" />
          </motion.div>
          <div className="absolute -top-3 -right-3">
             <Shield className="w-6 h-6 text-gold animate-pulse" />
          </div>
        </div>

        <div className="space-y-4 flex flex-col items-center">
          {/* Scanning Loading Bar */}
          <div className="w-64 h-1.5 bg-void/5 border border-white/10 rounded-sm overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 bg-gold shadow-[0_0:15px_rgba(212,175,55,0.8)]"
              animate={{ left: ['-20%', '120%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ width: '30%' }}
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-[11px] font-display font-extrabold uppercase tracking-[0.6em] text-white italic">
              INITIALIZING_AUTHORITY_CORE
            </p>
            <p className="text-[8px] font-mono text-gold/40 uppercase tracking-widest animate-pulse">
              [ SECURING_STATUTORY_HANDSHAKE ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
