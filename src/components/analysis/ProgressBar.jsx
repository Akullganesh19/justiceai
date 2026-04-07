import { motion } from 'framer-motion';

export function ProgressBar({ progress = 0 }) {
  // progress is 0-100
  const stages = [
    { label: 'Case Intake', threshold: 25 },
    { label: 'Reasoning', threshold: 50 },
    { label: 'Statute Mapping', threshold: 75 },
    { label: 'Final Strategy', threshold: 100 },
  ];

  return (
    <div className="w-full space-y-6 py-8 border-b-2 border-white/5 relative bg-void px-4 rounded-sm shadow-hard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-4 bg-gold animate-pulse rounded-sm shadow-hard" />
          <span className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/60 italic">
            ANALYSIS_PROGRESSION_METRICS
          </span>
        </div>
        <span className="text-[14px] font-display font-bold text-gold tracking-tighter">
          {progress}%
        </span>
      </div>

      <div className="relative h-2.5 w-full bg-void border-2 border-white/10 rounded-sm overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute h-full bg-gold shadow-hard"
        />
        {/* Subtle Shimmer Overlay */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2 pointer-events-none"
        />
      </div>

      <div className="flex justify-between px-2">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div
              className={`w-2 h-2 rounded-sm transition-all duration-500 ${progress >= stage.threshold ? 'bg-gold shadow-hard scale-125' : 'bg-white/5 border-2 border-white/10'}`}
            />
            <span
              className={`text-[8px] uppercase tracking-[0.2em] font-extrabold transition-colors duration-500 italic ${progress >= stage.threshold ? 'text-gold' : 'text-text-tertiary opacity-40'}`}
            >
              {stage.label.toUpperCase().replace(' ', '_')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
