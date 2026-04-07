import { motion } from 'framer-motion';

export function ProgressBar({ progress = 0 }) {
  // progress is 0-100
  const stages = [
    { label: 'INTAKE', threshold: 25 },
    { label: 'LOGIC', threshold: 50 },
    { label: 'DECODE', threshold: 75 },
    { label: 'STRATEGY', threshold: 100 },
  ];

  return (
    <div className="w-full space-y-4 py-6 border-b-2 border-white/5 relative bg-void/50 px-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-4 bg-red animate-pulse" />
          <span className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white">
            ANALYSIS_SEQUENCE_PROGRESS
          </span>
        </div>
        <span className="text-[12px] font-display font-bold text-red tracking-tighter italic">
          {progress}%
        </span>
      </div>

      <div className="relative h-4 w-full bg-void border-2 border-white/10 rounded-sm overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute h-full bg-red shadow-[0_0_20px_rgba(225,29,72,0.4)]"
        />
        {/* Scanning Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_100%]" />
      </div>

      <div className="flex justify-between px-1">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={`w-2 h-2 rounded-sm rotate-45 transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${progress >= stage.threshold ? 'bg-red border border-red-light/40 scale-125' : 'bg-void/10 border border-white/5'}`}
            />
            <span
              className={`text-[8px] uppercase tracking-[0.2em] font-extrabold transition-colors duration-500 ${progress >= stage.threshold ? 'text-red italic' : 'text-text-tertiary'}`}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
