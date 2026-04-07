import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Loader2,
  FileText,
  CheckCircle2,
  Search,
  Brain,
  Database,
  Cpu,
} from 'lucide-react';

const SCAN_STEPS = [
  'INITIALIZING_MULTI_MODAL_STATUTORY_ENGINE...',
  'EXECUTING_OCR_ON_PROCEDURAL_LAYERS...',
  'EXTRACTING_PARTY_IDENTITIES_&_COURT_DETAILS...',
  'MAPPING_CONTEXT_TO_BNS_2023_GUIDELINES...',
  'IDENTIFYING_CAUSE_OF_ACTION_WINDOW...',
  'BUILDING_EVIDENTIARY_STRENGTH_MATRIX...',
  'CORRELATING_SUPREME_COURT_PRECEDENTS...',
  'VERIFICATION_SUCCESSFUL. INITIALIZING_CASE_MANDATE...',
];

export default function DocumentScanningOverlay({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setProgress(0);

      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < SCAN_STEPS.length - 1) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, 500);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) return prev + 1;
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 500);
          return prev;
        });
      }, 35);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      >
        {/* Backdrop Backdrop blur plus darken */}
        <div className="absolute inset-0 bg-void/90 backdrop-blur-xl" />

        {/* Floating Scan Content */}
        <div className="relative w-full max-w-xl aspect-square md:aspect-video rounded-sm border-2 border-white/5 bg-void overflow-hidden shadow-hard flex flex-col items-center justify-center p-12 space-y-8">
          <div
            className="absolute top-0 left-0 w-full h-[2px] bg-gold shadow-[0_0_20px_rgba(212,175,55,0.5)] z-20"
            style={{ top: `${progress}%` }}
          />

          {/* Animated Core Icons */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 rounded-sm border-2 border-dashed border-gold/20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gold/10 rounded-sm flex items-center justify-center border-2 border-gold/30 shadow-hard shadow-gold/20">
                <Cpu className="w-10 h-10 text-gold animate-pulse" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-6 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 text-gold text-[9px] uppercase font-black tracking-[0.3em] rounded-sm border-2 border-gold/20 shadow-hard italic">
              <Brain className="w-3.5 h-3.5" />
              <span>STATUTORY_INTELLIGENCE_UNIT</span>
            </div>

            <h2 className="text-4xl font-display text-white uppercase italic tracking-tighter">
              DEEP_ANALYSIS: <span className="text-gold">CASE_PROCURAL</span>
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-end text-[10px] uppercase font-extrabold tracking-[0.4em] italic">
                <span className="text-text-tertiary">PROCEDURAL_EXTRACTION</span>
                <span className="text-gold">{progress}%</span>
              </div>
              <div className="h-2 bg-void rounded-sm overflow-hidden border-2 border-white/5 shadow-inner">
                <motion.div className="h-full bg-gold" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Step Text */}
            <div className="h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-[10px] text-text-secondary font-mono font-bold italic uppercase tracking-widest"
                >
                  {SCAN_STEPS[currentStep]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Floating Floating Scan Details */}
          <div className="absolute top-12 left-12 opacity-5 pointer-events-none hidden md:block">
            <Database className="w-24 h-24 text-gold" />
          </div>
          <div className="absolute bottom-12 right-12 opacity-5 pointer-events-none hidden md:block">
            <Search className="w-24 h-24 text-gold" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
