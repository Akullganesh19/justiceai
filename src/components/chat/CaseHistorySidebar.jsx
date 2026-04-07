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
      className="relative bg-void border-r-2 border-white/5 h-full flex flex-col group overflow-hidden"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-red border-2 border-red-light/20 flex items-center justify-center text-white shadow-[4px_0px_15px_rgba(225,29,72,0.3)] z-50 transition-all hover:w-10 ${isOpen ? 'rounded-l-lg' : 'rotate-180 hover:bg-red-dark rounded-r-lg'}`}
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
            <div className="p-8 border-b-2 border-white/5 space-y-6 bg-void/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-red">
                  <History className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-extrabold tracking-[0.4em]">
                    Historical_Logs
                  </span>
                </div>
                <button
                  onClick={onNew}
                  className="p-3 rounded bg-void border-2 border-red/40 text-red hover:bg-red hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)] active:translate-x-[1px] active:translate-y-[1px]"
                  title="Initialize New Session"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto px-6 py-10 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_left_top,rgba(255,255,255,0.02)_0%,transparent_50%)]">
              {history.length === 0 ? (
                <div className="text-center py-20 px-8 space-y-6">
                  <div className="w-16 h-16 rounded bg-void border-2 border-white/5 flex items-center justify-center mx-auto text-white/20 shadow-inner">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] text-text-tertiary leading-relaxed font-extrabold uppercase tracking-widest italic opacity-40">
                    No active sessions detected. Initialize primary objective.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative p-5 rounded border-2 transition-all cursor-pointer ${
                      currentCaseId === item.id
                        ? 'bg-void border-red/60 shadow-[8px_8px_0px_0px_rgba(159,18,57,0.2)]'
                        : 'bg-void border-white/5 hover:border-white/20'
                    }`}
                    onClick={() => onSelect(item.id)}
                  >
                    <div className="space-y-2 pr-8">
                      <h4
                        className={`text-xs font-bold uppercase tracking-tight truncate italic transition-colors ${currentCaseId === item.id ? 'text-red' : 'text-white/60 group-hover:text-white'}`}
                      >
                        {item.title || 'NULL_SESSION_LOG'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1 h-1 rounded-full ${currentCaseId === item.id ? 'bg-red animate-pulse' : 'bg-void/10'}`}
                        />
                        <p className="text-[9px] text-text-tertiary font-extrabold tracking-widest opacity-60">
                          {new Date(item.timestamp).toLocaleDateString()} // SESSION_
                          {item.id.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded text-text-tertiary hover:bg-red/10 hover:text-red opacity-0 group-hover:opacity-100 transition-all border-2 border-transparent hover:border-red/20 shadow-sm"
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
