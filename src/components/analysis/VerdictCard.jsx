import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertTriangle, Scale } from 'lucide-react';

export function VerdictCard({ verdict, confidence }) {
  const variants = {
    win: {
      label: 'favorable',
      icon: Trophy,
      color: 'text-emerald-400',
      bg: 'bg-midnight',
      border: 'border-emerald-400/20',
      shadow: 'shadow-hard',
      description:
        'The facts of your case align strongly with established Indian legal precedents and current BNS statutes.',
    },
    loss: {
      label: 'unfavorable',
      icon: AlertTriangle,
      color: 'text-gold',
      bg: 'bg-midnight',
      border: 'border-gold/20',
      shadow: 'shadow-hard',
      description:
        'Based on current parameters, there are significant procedural hurdles to overcome. Strategic adjustments are recommended.',
    },
    partial: {
      label: 'partial',
      icon: Scale,
      color: 'text-blue-400',
      bg: 'bg-midnight',
      border: 'border-blue-400/20',
      shadow: 'shadow-hard',
      description:
        'The case has merit, but successful execution depends heavily on specific evidentiary support and jurisdictional factors.',
    },
  };

  const config = variants[verdict] || variants.partial;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`p-10 rounded-sm border ${config.bg} ${config.border} space-y-8 ${config.shadow} active:translate-y-[2px] transition-all cursor-default relative overflow-hidden group`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-all pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div
          className={`p-5 rounded-sm bg-midnight border ${config.border} shadow-hard`}
        >
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold opacity-60">
            Probability of Success
          </p>
          <h3
            className={`text-3xl font-display font-bold ${config.color} uppercase tracking-tight mt-1`}
          >
            {config.label}
          </h3>
        </div>
      </div>

      <p className="text-sm font-body text-text-tertiary leading-relaxed border-l border-white/10 pl-8 italic opacity-80">
        {config.description}
      </p>

      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-end px-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary opacity-40">
            Institutional Reliability
          </span>
          <span className={`text-sm font-display font-bold ${config.color}`}>{confidence}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-sm overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full ${verdict === 'win' ? 'bg-emerald-400' : verdict === 'loss' ? 'bg-gold' : 'bg-blue-400'} shadow-luxe`}
          />
        </div>
      </div>
    </motion.div>
  );
}
