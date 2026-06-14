import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Plus, ChevronLeft, FileText, Trash2, Search, X, Edit2, Star } from 'lucide-react';

export function CaseHistorySidebar({
  history,
  currentCaseId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onToggleFavorite,
  isOpen,
  setIsOpen,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef(null);

  const filteredHistory = useMemo(() => {
    let result = history;
    if (showOnlyFavorites) {
      result = result.filter((item) => item.isFavorite);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.messages?.some((m) => m.content.toLowerCase().includes(query)),
      );
    }
    return result;
  }, [history, searchQuery, showOnlyFavorites]);

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

              {/* Search Registry Input & Filter */}
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary group-focus-within:text-gold transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH_REGISTRY..."
                    className="w-full bg-void border-2 border-white/5 rounded-sm pl-11 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-text-tertiary/30 focus:outline-none focus:border-gold/40 transition-all italic"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-white text-text-tertiary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`p-3 rounded-sm border-2 transition-all ${showOnlyFavorites ? 'bg-gold/10 border-gold text-gold shadow-luxe' : 'bg-void border-white/5 text-text-tertiary hover:border-white/20'}`}
                  title={showOnlyFavorites ? 'Show All' : 'Show Favorites'}
                >
                  <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-gold' : ''}`} />
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto px-6 py-10 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_left_top,rgba(212,175,55,0.02)_0%,transparent_50%)]">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-20 px-8 space-y-6 opacity-40">
                  <div className="w-16 h-16 rounded-2xl bg-midnight border border-white/5 flex items-center justify-center mx-auto text-white shadow-inner">
                    {searchQuery ? <Search className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                  </div>
                  <p className="text-[10px] text-text-tertiary leading-relaxed font-bold uppercase tracking-widest italic">
                    {searchQuery
                      ? `No records matching "${searchQuery.toUpperCase()}"`
                      : 'No history found. Start a new consultation to begin.'}
                  </p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                      currentCaseId === item.id
                        ? 'bg-midnight-slate/40 border-gold/40 shadow-premium'
                        : 'bg-midnight border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => onSelect(item.id)}
                  >
                    <div className="space-y-2 pr-12">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            ref={editInputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => {
                              onRename(item.id, editValue);
                              setEditingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onRename(item.id, editValue);
                                setEditingId(null);
                              }
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-void border border-gold/40 text-xs font-display font-bold uppercase tracking-tight text-white px-2 py-1 rounded-sm w-full outline-none focus:border-gold shadow-luxe italic"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <h4
                          className={`text-xs font-display font-bold uppercase tracking-tight truncate transition-colors ${currentCaseId === item.id ? 'text-gold' : 'text-white/60 group-hover:text-white'}`}
                        >
                          {item.title || 'Untitled Consultation'}
                        </h4>
                      )}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1 h-1 rounded-full ${currentCaseId === item.id ? 'bg-gold animate-pulse' : 'bg-white/10'}`}
                        />
                        <p className="text-[9px] text-text-tertiary font-bold tracking-widest opacity-60">
                          {new Date(item.timestamp).toLocaleDateString()} • ID_{item.id.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-all ${item.isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className={`p-2 rounded-lg transition-colors border border-transparent ${item.isFavorite ? 'text-gold hover:bg-gold/10 hover:border-gold/20' : 'text-text-tertiary hover:bg-gold/10 hover:text-gold hover:border-gold/20'}`}
                        title={item.isFavorite ? 'Unstar' : 'Star'}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-gold' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(item.id);
                          setEditValue(item.title || '');
                        }}
                        className="p-2 rounded-lg text-text-tertiary hover:bg-gold/10 hover:text-gold border border-transparent hover:border-gold/20"
                        title="Rename Consultation"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="p-2 rounded-lg text-text-tertiary hover:bg-red/10 hover:text-red-400 border border-transparent hover:border-red-400/20"
                        title="Delete Consultation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
