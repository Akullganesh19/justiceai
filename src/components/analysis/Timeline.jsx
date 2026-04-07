import { motion } from 'framer-motion';

export function Timeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="space-y-8 pt-10 border-t-2 border-white/5 relative">
      <div className="absolute top-0 left-0 w-2 h-10 bg-red opacity-20" />
      <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-text-tertiary block mb-6 italic">
        Sequential Case Progress
      </label>

      <div className="space-y-6 relative">
        {timeline.map((item, i) => {
          const isActive = item.status === 'active';
          const isCompleted = item.status === 'completed';

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-12 pb-8 last:pb-0 group"
            >
              {/* Vertical Line */}
              {i < timeline.length - 1 && (
                <div
                  className={`absolute left-[13px] top-8 w-[2px] h-full ${isCompleted ? 'bg-accent-success/30' : 'bg-void/10'} transition-colors`}
                />
              )}

              {/* Status Indicator */}
              <div className="absolute left-0 top-1.5 flex items-center justify-center">
                <div
                  className={`w-7 h-7 rounded sm bg-void border-2 flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${
                    isCompleted
                      ? 'border-accent-success text-accent-success'
                      : isActive
                        ? 'border-red text-red animate-pulse'
                        : 'border-white/10 text-white/20'
                  }`}
                >
                  {isCompleted ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-success" />
                  ) : isActive ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-red animate-ping" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-void/10" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest">{`PHASE_0${i + 1}`}</span>
                  <div className={`h-[1px] flex-1 ${isActive ? 'bg-red/20' : 'bg-void/5'}`} />
                  {isActive && (
                    <span className="text-[9px] font-extrabold text-red uppercase tracking-widest animate-pulse">
                      [ PROCESSING ]
                    </span>
                  )}
                </div>
                <h4
                  className={`text-sm font-bold uppercase tracking-tight transition-colors ${isActive ? 'text-red italic' : isCompleted ? 'text-white' : 'text-text-tertiary'}`}
                >
                  {item.stage}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-body italic group-hover:text-white transition-colors">
                  {item.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
