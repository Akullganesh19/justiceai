import { Milestone, Scale, Quote, AlertTriangle, MessageSquare } from 'lucide-react';

export function CourtroomPrepCard({ prep, grounds }) {
  if (!prep) return null;

  return (
    <div className="space-y-12 pt-16 border-t border-white/5 relative">
      <div className="absolute top-0 left-0 w-1.5 h-12 bg-gold/20 rounded-sm" />
      <div className="flex items-center gap-4">
        <Milestone className="w-6 h-6 text-gold" />
        <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-white italic">
          COURTROOM_PREPARATION_PROTOCOLS
        </h3>
      </div>

      {/* Statutory & Constitutional Basis */}
      {grounds && grounds.length > 0 && (
        <div className="p-10 rounded-sm bg-void border-2 border-white/5 space-y-8 shadow-hard relative overflow-hidden group/ground">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/5 blur-3xl rounded-full opacity-50 group-hover/ground:bg-blue-400/10 transition-all pointer-events-none" />
          <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-blue-400 flex items-center gap-3 relative z-10 italic">
            <Scale className="w-4 h-4" />
            <span>STATUTORY_FOUNDATION_UNITS</span>
          </label>
          <div className="flex flex-wrap gap-4 relative z-10">
            {grounds.map((ground, i) => (
              <span
                key={i}
                className="text-[10px] px-5 py-2.5 rounded-sm bg-blue-400/5 border-2 border-blue-400/20 text-white font-extrabold tracking-widest uppercase italic shadow-hard transition-all hover:bg-blue-400/10"
              >
                {ground}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Opening Statement */}
      <div className="p-10 rounded-sm bg-void border-2 border-gold/40 space-y-8 relative overflow-hidden group/statement shadow-hard">
        <Quote className="absolute top-8 right-8 w-16 h-16 text-gold/10 -rotate-12 transition-transform group-hover/statement:scale-110" />
        <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-gold flex items-center gap-3 italic">
          <span>OPENING_STATEMENT_STRATEGY_BUFFER</span>
        </label>
        <p className="text-[17px] italic text-white leading-relaxed font-body relative z-10 border-l-2 border-gold/20 pl-8 opacity-90">
          "{prep.openingStatement}"
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* What NOT to say */}
        <div className="space-y-6">
          <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-gold italic">
            <AlertTriangle className="w-4 h-4" />
            <span>ADVISORY_COMMUNICATION_RISKS</span>
          </label>
          <ul className="space-y-4">
            {prep.whatNotToSay?.map((item, i) => (
              <li
                key={i}
                className="text-xs text-text-tertiary leading-relaxed bg-void p-6 rounded-sm border-2 border-gold/10 shadow-hard italic opacity-80 hover:opacity-100 transition-opacity"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Judge Questions */}
        <div className="space-y-6">
          <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-emerald-400 italic">
            <MessageSquare className="w-4 h-4" />
            <span>ANTICIPATED_BENCH_INQUIRIES</span>
          </label>
          <div className="space-y-6">
            {prep.judgeQuestions?.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-sm bg-void border-2 border-white/5 space-y-4 group transition-all shadow-hard border-l-4 border-l-emerald-400/40 hover:border-emerald-400/30"
              >
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest opacity-60">
                    Question
                  </p>
                  <p className="text-[13px] text-white font-display font-bold leading-tight italic">
                    {item.question}
                  </p>
                </div>
                <div className="space-y-1 pt-3 border-t border-white/5">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest opacity-40">
                    Recommended Response
                  </p>
                  <p className="text-[13px] text-text-tertiary leading-relaxed font-body italic opacity-80">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
