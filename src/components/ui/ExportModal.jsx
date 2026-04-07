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
            className="relative w-full max-w-2xl premium-blur border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-raised">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple" />
                <h3 className="text-xl font-display text-white">Case Summary Report</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-void/5 rounded-full text-text-tertiary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-void/50">
              <div className="bg-raised/80 border border-white/5 p-6 rounded-2xl h-[400px] overflow-y-auto custom-scrollbar font-mono text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap selection:bg-purple/20">
                {summary}
              </div>
            </div>

            <div className="p-6 bg-raised border-t border-white/5 flex flex-col md:flex-row gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all active:scale-95 ${
                  copied
                    ? 'bg-accent-success/20 text-accent-success border border-accent-success/30'
                    : 'bg-purple text-void hover:bg-purple-light'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Text Summary'}</span>
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
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-void/5 text-text-primary hover:bg-void/10 border border-white/10 transition-all font-medium active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Save .txt</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
