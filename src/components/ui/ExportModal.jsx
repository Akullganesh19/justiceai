import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, summary }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-void border-2 border-white/10 rounded-sm overflow-hidden shadow-hard"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-raised">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gold" />
                <h3 className="text-xl font-display text-white italic uppercase tracking-tighter">STRATEGY_SUMMARY_REPORT</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-sm text-text-tertiary transition-colors border-2 border-transparent hover:border-white/10 shadow-hard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-void/50">
              <div className="bg-void border-2 border-white/5 p-6 rounded-sm h-[400px] overflow-y-auto custom-scrollbar font-mono text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap selection:bg-gold/20 italic opacity-80 uppercase tracking-widest">
                {summary}
              </div>
            </div>

            <div className="p-6 bg-raised border-t border-white/5 flex flex-col md:flex-row gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-sm font-extrabold transition-all active:translate-y-[2px] uppercase text-[11px] tracking-[0.2em] italic shadow-hard border-2 ${
                  copied
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                    : 'bg-gold text-midnight border-gold-light/40 hover:bg-gold-light'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'CACHED_TO_BUFFER' : 'EXFILTRATE_TEXT_SUMMARY'}</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([summary], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `justiceai-case-summary-${new Date().getTime()}.txt`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-sm bg-void text-text-primary hover:bg-white/5 border-2 border-white/10 transition-all font-extrabold uppercase text-[11px] tracking-[0.2em] italic shadow-hard active:translate-y-[2px]"
              >
                <Download className="w-5 h-5" />
                <span>SAVE_AS_TEXT</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
