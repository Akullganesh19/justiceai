import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertTriangle, Scale } from 'lucide-react';

export function VerdictCard({ verdict, confidence }) {
  const variants = {
    win: {
      label: 'favorable',
      icon: Trophy,
      color: 'text-accent-success',
      bg: 'bg-void',
      border: 'border-accent-success/40',
      shadow: 'shadow-[8px_8px_0px_0px_rgba(34,197,94,0.1)]',
      description:
        'The facts of your case align strongly with established Indian legal precedents and current BNS statutes.',
    },
    loss: {
      label: 'unfavorable',
      icon: AlertTriangle,
      color: 'text-red',
      bg: 'bg-void',
      border: 'border-red/40',
      shadow: 'shadow-[8px_8px_0px_0px_rgba(225,29,72,0.1)]',
      description:
        'Based on current parameters, there are significant procedural hurdles to overcome. Strategic pivot required.',
    },
    partial: {
      label: 'partial',
      icon: Scale,
      color: 'text-blue',
      bg: 'bg-void',
      border: 'border-blue/40',
      shadow: 'shadow-[8px_8px_0px_0px_rgba(37,99,235,0.1)]',
      description:
        'Case has merit, but execution stability depends heavily on specific document evidence and jurisdictional oversight.',
    },
  };

  const config = variants[verdict] || variants.partial;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`p-8 rounded-xl border-2 ${config.bg} ${config.border} space-y-6 ${config.shadow} active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-default relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-void/5 blur-3xl rounded-full opacity-10" />

      <div className="flex items-center justify-between border-b-2 border-white/5 pb-6">
        <div
          className={`p-4 rounded bg-void border-2 ${config.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]`}
        >
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-tertiary font-extrabold">
            SUCCESS_PROBABILITY
          </p>
          <h3
            className={`text-3xl font-display font-bold ${config.color} uppercase tracking-tighter italic mt-1`}
          >
            {config.label}
          </h3>
        </div>
      </div>

      <p className="text-xs font-body text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6 italic">
        {config.description}
      </p>

      <div className="space-y-3 pt-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary">
            TACTICAL_GROUNDING
          </span>
          <span className={`text-sm font-display font-bold ${config.color}`}>{confidence}%</span>
        </div>
        <div className="h-3 bg-void rounded overflow-hidden border-2 border-white/10 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full ${verdict === 'win' ? 'bg-accent-success' : verdict === 'loss' ? 'bg-red' : 'bg-blue'} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
          />
        </div>
      </div>
    </motion.div>
  );
}
