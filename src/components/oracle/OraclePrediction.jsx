import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function OraclePrediction({ prediction, onDismiss }) {
  if (!prediction || !prediction.domain) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-sm bg-indigo-500/10 border-2 border-indigo-500/30 shadow-hard mb-8 relative overflow-hidden group mt-6"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full opacity-50 group-hover:bg-indigo-500/20 transition-all" />

      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-indigo-400/50 hover:text-indigo-400 transition-colors z-20"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4 relative z-10">
        <div className="w-12 h-12 rounded-sm bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
          <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Oracle Prediction
            </h4>
            <span className="px-2 py-0.5 rounded-sm bg-indigo-500/20 text-indigo-400 font-extrabold tracking-widest text-[9px] border border-indigo-500/30 shadow-hard">
              {prediction.confidence}% MATCH
            </span>
          </div>
          <p className="text-xs text-indigo-200/80 font-mono italic">
            We pre-selected the <strong className="text-indigo-300 font-bold uppercase tracking-wider">{prediction.domain}</strong> specialization based on your recent activity. {prediction.reason}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
