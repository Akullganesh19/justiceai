import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, FileText, Send, Download, Scale, Milestone, Info } from 'lucide-react';
import { VerdictCard } from './VerdictCard';
import { StrategyList, LawsList } from './Lists';
import { Timeline } from './Timeline';
import { ProgressBar } from './ProgressBar';
import { CourtroomPrepCard } from './CourtroomPrepCard';

export function ArgumentsPanel({ forArgs, againstArgs }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
      <div className="space-y-6">
        <label className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Strategic Arguments</span>
        </label>
        <ul className="space-y-3">
          {forArgs?.map((arg, i) => (
            <li
              key={i}
              className="text-[12px] text-text-secondary leading-relaxed bg-midnight-slate/30 p-5 rounded-2xl border border-emerald-400/20 font-body shadow-premium italic"
            >
              {arg}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <label className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-gold">
          <XCircle className="w-4 h-4" />
          <span>Risks & Counters</span>
        </label>
        <ul className="space-y-3">
          {againstArgs?.map((arg, i) => (
            <li
              key={i}
              className="text-[12px] text-text-secondary leading-relaxed bg-midnight-slate/30 p-5 rounded-2xl border border-gold/20 font-body shadow-premium italic"
            >
              {arg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const JURISDICTION_RESOURCES = {
  National: {
    court: 'Supreme Court of India',
    link: 'https://main.sci.gov.in',
    slsa: 'NALSA',
    help: '15100',
  },
  Delhi: {
    court: 'Delhi High Court',
    link: 'https://delhihighcourt.nic.in',
    slsa: 'DSLSA',
    help: '1516',
  },
  Maharashtra: {
    court: 'Bombay High Court',
    link: 'https://bombayhighcourt.nic.in',
    slsa: 'MSLSA',
    help: '022-22691395',
  },
  Karnataka: {
    court: 'Karnataka High Court',
    link: 'https://karnatakajudiciary.kar.nic.in',
    slsa: 'KSLSA',
    help: '1800-425-9090',
  },
  'Tamil Nadu': {
    court: 'Madras High Court',
    link: 'https://hcmadras.tn.gov.in',
    slsa: 'TNSLSA',
    help: '044-25342441',
  },
  'West Bengal': {
    court: 'Calcutta High Court',
    link: 'https://calcuttahighcourt.gov.in',
    slsa: 'WBSLSA',
    help: '1800-345-3888',
  },
};

export default function AnalysisPanel({
  analysis,
  selectedJurisdiction = 'National',
  onExport,
  isLoading,
  progress = 0,
}) {
  const resource =
    JURISDICTION_RESOURCES[selectedJurisdiction] || JURISDICTION_RESOURCES['National'];

  if (!analysis && progress < 20) {
    return (
      <div className="h-full flex flex-col pt-4 bg-midnight">
        <div className="px-8 pb-6">
          <ProgressBar progress={progress} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-midnight border border-white/10 flex items-center justify-center shadow-premium relative group">
            <div className="absolute inset-0 bg-gold/5 p-2 animate-pulse rounded-3xl" />
            <Scale className="w-12 h-12 text-gold relative z-10 group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
              Awaiting Consultation
            </h3>
            <p className="text-xs text-text-tertiary max-w-[320px] leading-relaxed mx-auto font-body opacity-60">
              Provide your case details or upload a document to begin generating your strategic legal assessment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || (!analysis && progress >= 20)) {
    return (
      <div className="h-full flex flex-col pt-4 bg-midnight">
        <div className="px-8 pb-6">
          <ProgressBar progress={progress} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-x-[-60px] inset-y-[-60px] bg-gold/10 rounded-full blur-3xl opacity-20"
            />
            <div className="w-16 h-16 rounded-sm border-2 border-white/5 border-t-gold animate-spin relative z-10 shadow-hard" />
          </div>
          <div className="space-y-4 relative z-10">
            <p className="text-lg text-gold font-display font-bold tracking-widest uppercase italic">
              ANALYZING_STATUTORY_PARAMETERS
            </p>
            <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest animate-pulse opacity-60">
              Correlating {selectedJurisdiction} Statutes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col pt-2 md:pt-4 bg-void"
    >
      <div className="px-8 pb-6">
        <ProgressBar progress={progress} />
      </div>

      <div className="flex-1 overflow-y-auto px-8 space-y-12 pb-24 custom-scrollbar">
        {/* Header Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-gold/10 text-gold text-[10px] uppercase font-extrabold tracking-widest rounded-sm border-2 border-gold/20 shadow-hard italic">
                {analysis.caseType || 'STRATEGIC_ANALYSIS_MANDATE'}
              </span>
            </div>
            <span className="text-[9px] text-white/20 font-bold tracking-widest uppercase">
              REFERENCE: JAI-{Math.floor(Math.random() * 89999) + 10000}
            </span>
          </div>

          <VerdictCard verdict={analysis.verdict} confidence={analysis.confidence} />
        </div>

        {/* Localized Resources */}
        <div className="p-8 bg-void rounded-sm border-2 border-white/5 space-y-6 shadow-hard relative overflow-hidden group/resource">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-sm opacity-50 group-hover/resource:bg-gold/10 transition-all" />
          <div className="flex items-center gap-3 relative z-10">
            <Scale className="w-5 h-5 text-gold" />
            <h4 className="text-[11px] uppercase font-extrabold tracking-widest text-white">
              JURISDICTION: {selectedJurisdiction.toUpperCase()}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="p-5 bg-void border-2 border-white/5 rounded-sm hover:border-gold/40 transition-all group shadow-hard"
            >
              <p className="text-[10px] text-text-tertiary uppercase font-extrabold mb-2 tracking-widest opacity-40 italic">
                OFFICIAL_PORTAL
              </p>
              <p className="text-xs text-white font-display font-bold uppercase tracking-tight group-hover:text-gold truncate italic">
                {resource.court}
              </p>
            </a>
            <div className="p-5 bg-void border-2 border-white/5 rounded-sm shadow-hard border-l-4 border-l-gold">
              <p className="text-[10px] text-text-tertiary uppercase font-extrabold mb-2 tracking-widest opacity-40 italic">
                LEGAL_AID_HELPLINE
              </p>
              <p className="text-sm text-gold font-bold tracking-widest">{resource.help}</p>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <Timeline timeline={analysis.timeline} />

        {/* Actionable Content */}
        <div className="grid gap-12 pt-8">
          <StrategyList strategy={analysis.strategy} />
          <LawsList laws={analysis.laws} />
        </div>

        {/* Courtroom Preparation */}
        <CourtroomPrepCard prep={analysis.courtroomPrep} grounds={analysis.constitutionalGrounds} />

        {/* Arguments Mapping */}
        <ArgumentsPanel
          forArgs={analysis.arguments?.for}
          againstArgs={analysis.arguments?.against}
        />

        {/* Export Action */}
        <div className="pt-16 border-t border-white/5 pb-16">
          <button
            onClick={onExport}
            className="w-full flex items-center justify-center gap-4 bg-gold text-midnight px-10 py-6 rounded-sm border-2 border-gold-light/20 font-extrabold text-lg uppercase tracking-widest hover:bg-gold-light transition-all shadow-hard active:translate-y-[2px] italic"
          >
            <Download className="w-6 h-6" />
            <span>EXPORT_STRATEGY_REPORT</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
