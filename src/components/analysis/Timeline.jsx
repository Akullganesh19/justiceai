import { motion } from 'framer-motion';
import { Milestone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';

export function Timeline({ timeline }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  if (!timeline || timeline.length === 0) return null;

  const handleExportToTracker = () => {
    const existingCasesRaw = localStorage.getItem('justice_ai_case_tracker_v2');
    const existingCases = existingCasesRaw ? JSON.parse(existingCasesRaw) : [];

    const steps = timeline.map((item, index) => ({
      id: index + 1,
      label: item.stage || `Phase ${index + 1}`,
      description: item.detail || '',
      completed: item.status === 'completed',
    }));

    const newCase = {
      id: Date.now().toString(),
      name: `AI Strategy: ${timeline[0]?.stage || 'New Case'}`,
      caseType: 'custom',
      steps: steps,
      createdAt: new Date().toISOString(),
      details: {
        caseNumber: '',
        courtName: '',
        bench: '',
        advocateName: '',
        advocatePhone: '',
        oppositeParty: '',
        nextHearing: '',
      },
    };

    localStorage.setItem('justice_ai_case_tracker_v2', JSON.stringify([...existingCases, newCase]));

    addToast({
      title: 'CASE_ESTABLISHED',
      description: 'Strategy timeline exported to Case Tracker.',
      type: 'success'
    });

    navigate('/tracker');
  };

  return (
    <div className="space-y-10 pt-12 border-t border-white/5 relative">
      <div className="absolute top-0 left-0 w-1.5 h-10 bg-gold/20 rounded-sm" />

      <div className="flex items-center justify-between mb-8">
        <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-text-tertiary opacity-60 italic m-0">
          CASE_PROGRESSION_TIMELINE
        </label>

        <button
          onClick={handleExportToTracker}
          className="flex items-center gap-2 bg-void border border-gold/30 hover:border-gold hover:bg-gold/10 text-gold px-4 py-2 rounded-sm transition-all shadow-hard group"
          title="Export this timeline to the Case Tracker"
        >
          <Milestone className="w-3.5 h-3.5" />
          <span className="text-[9px] font-extrabold uppercase tracking-widest italic">Track Case</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-8 relative">
        {timeline.map((item, i) => {
          const isActive = item.status === 'active';
          const isCompleted = item.status === 'completed';

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-14 pb-10 last:pb-0 group"
            >
              {/* Vertical Line */}
              {i < timeline.length - 1 && (
                <div
                  className={`absolute left-[13px] top-10 w-[1px] h-full ${isCompleted ? 'bg-emerald-400/30' : 'bg-white/5'} transition-colors`}
                />
              )}

              {/* Status Indicator */}
              <div className="absolute left-0 top-1.5 flex items-center justify-center">
                <div
                  className={`w-7 h-7 rounded-sm bg-void border-2 flex items-center justify-center transition-all shadow-hard ${
                    isCompleted
                      ? 'border-emerald-400 text-emerald-400'
                      : isActive
                        ? 'border-gold text-gold shadow-hard'
                        : 'border-white/10 text-white/20'
                  }`}
                >
                  {isCompleted ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ) : isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{`Phase ${i + 1}`}</span>
                  <div className={`h-[1px] flex-1 ${isActive ? 'bg-gold/20' : 'bg-white/5'}`} />
                  {isActive && (
                    <span className="text-[9px] font-extrabold text-gold uppercase tracking-widest animate-pulse italic">
                      CURRENT_STATUS_ACTIVE
                    </span>
                  )}
                </div>
                <h4
                  className={`text-[15px] font-display font-bold uppercase tracking-tight transition-colors ${isActive ? 'text-gold' : isCompleted ? 'text-white' : 'text-text-tertiary'}`}
                >
                  {item.stage}
                </h4>
                <p className="text-sm text-text-tertiary leading-relaxed font-body italic group-hover:text-white transition-colors opacity-80">
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
