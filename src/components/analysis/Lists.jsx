import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Milestone, ExternalLink } from 'lucide-react';

export function StrategyList({ strategy }) {
  if (!strategy || !Array.isArray(strategy) || strategy.length === 0) return null;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 border-b border-white/5 pb-5">
        <div className="w-1.5 h-6 bg-gold rounded-sm shadow-hard" />
        <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-white italic">
          LEGAL_STRATEGY_PROTOCOL
        </h3>
      </div>

      <div className="space-y-8">
        {strategy.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-8 group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-void border-2 border-gold/40 flex items-center justify-center font-display text-[14px] text-white font-extrabold group-hover:bg-gold group-hover:text-midnight transition-all shadow-hard italic">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-extrabold opacity-60 group-hover:opacity-100 transition-opacity italic">
                RECOMMENDATION_{i + 1}
              </p>
              <p className="text-[15px] leading-relaxed text-text-tertiary group-hover:text-white transition-colors font-body italic opacity-80">
                {step}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function LawsList({ laws }) {
  if (!laws || !Array.isArray(laws) || laws.length === 0) return null;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 border-b border-white/5 pb-5">
        <div className="w-1.5 h-6 bg-blue-400 rounded-sm shadow-hard" />
        <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-white italic">
          STATUTORY_CITATIONS_INDEX
        </h3>
      </div>

      <div className="grid gap-6">
        {laws.map((law, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 rounded-sm bg-void border-2 border-white/5 hover:border-blue-400/40 transition-all group shadow-hard active:translate-y-[2px]"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-[10px] text-blue-400 font-extrabold uppercase tracking-widest bg-blue-400/5 px-4 py-1.5 rounded-sm border-2 border-blue-400/20 shadow-hard italic">
                {law.act}
              </span>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[13px] leading-relaxed text-text-tertiary group-hover:text-white transition-colors font-body italic mb-6 border-l border-white/10 pl-6 opacity-80">
              {law.description}
            </p>
            <a
              href={`https://indiankanoon.org/search/?formInput=${encodeURIComponent(law.act)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] text-text-tertiary font-bold uppercase tracking-widest hover:text-blue-400 hover:opacity-100 transition-all border-b border-transparent hover:border-blue-400 pb-0.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Citation
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
