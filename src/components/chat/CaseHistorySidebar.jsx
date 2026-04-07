import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Plus, ChevronLeft, ChevronRight, FileText, Trash2 } from 'lucide-react';

export function CaseHistorySidebar({
  history,
  currentCaseId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  setIsOpen,
}) {
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 320 : 0 }}
      className="relative bg-midnight border-r border-white/5 h-full flex flex-col group overflow-hidden"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-14 bg-gold border border-gold-light/20 flex items-center justify-center text-midnight shadow-luxe z-50 transition-all hover:w-10 ${isOpen ? 'rounded-l-2xl' : 'rotate-180 hover:bg-gold-light rounded-r-2xl'}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col min-w-[320px] overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className="p-8 border-b border-white/5 space-y-6 bg-midnight-slate/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gold">
                  <History className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                    Consultation History
                  </span>
                </div>
                <button
                  onClick={onNew}
                  className="p-3 rounded-xl bg-gold text-midnight hover:bg-gold-light transition-all shadow-luxe active:translate-y-[1px]"
                  title="New Consultation"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto px-6 py-10 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_left_top,rgba(212,175,55,0.02)_0%,transparent_50%)]">
              {history.length === 0 ? (
                <div className="text-center py-20 px-8 space-y-6 opacity-40">
                  <div className="w-16 h-16 rounded-2xl bg-midnight border border-white/5 flex items-center justify-center mx-auto text-white shadow-inner">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] text-text-tertiary leading-relaxed font-bold uppercase tracking-widest italic">
                    No history found. Start a new consultation to begin.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                      currentCaseId === item.id
                        ? 'bg-midnight-slate/40 border-gold/40 shadow-premium'
                        : 'bg-midnight border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => onSelect(item.id)}
                  >
                    <div className="space-y-2 pr-8">
                      <h4
                        className={`text-xs font-display font-bold uppercase tracking-tight truncate transition-colors ${currentCaseId === item.id ? 'text-gold' : 'text-white/60 group-hover:text-white'}`}
                      >
                        {item.title || 'Untitled Consultation'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1 h-1 rounded-full ${currentCaseId === item.id ? 'bg-gold animate-pulse' : 'bg-white/10'}`}
                        />
                        <p className="text-[9px] text-text-tertiary font-bold tracking-widest opacity-60">
                          {new Date(item.timestamp).toLocaleDateString()} • ID_{item.id.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-text-tertiary hover:bg-gold/10 hover:text-gold opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-gold/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
