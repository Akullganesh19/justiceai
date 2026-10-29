import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  ArrowRight,
  FileText,
  Calendar,
  MessageSquare,
  Scale,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/ui/Header.jsx';
import Footer from '../components/ui/Footer.jsx';

export default function HistoryDigestPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('justice_ai_history');
    if (saved) {
      try {
        setTimeout(() => setCases(JSON.parse(saved)), 0);
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = cases.filter((c) => c.id !== id);
    setCases(updated);
    localStorage.setItem('justice_ai_history', JSON.stringify(updated));
  };

  const filteredCases = cases.filter((c) =>
    (c.title || 'Untitled Consultation').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-void relative overflow-hidden font-mono text-slate-200">
      <div className="aurora-effect">
        <div className="aurora-blob bg-gold/5 opacity-20"></div>
        <div className="aurora-blob bg-blue-500/5 opacity-10"></div>
      </div>
      <div className="grain-overlay pointer-events-none opacity-[0.03]" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 pb-12 border-b border-white/5">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-14 h-14 rounded-sm bg-gold/5 border-2 border-gold/20 flex items-center justify-center shadow-luxe">
                  <History className="w-7 h-7 text-gold" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
                    System Records
                  </span>
                  <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter text-white leading-none italic">
                    HISTORY_DIGEST
                  </h1>
                </div>
              </div>
              <p className="text-text-tertiary font-body text-lg max-w-2xl border-l-2 border-gold/20 pl-8 mx-auto md:mx-0 opacity-80">
                A comprehensive archive of all your past legal consultations, analyses, and strategy sessions with JusticeAI.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="SEARCH_ARCHIVE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-void border-2 border-white/10 rounded-sm pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-gold/40 text-white placeholder:text-text-tertiary shadow-hard uppercase tracking-widest italic w-full md:w-[300px] transition-all"
                />
              </div>
              <button
                onClick={() => navigate('/chat')}
                className="bg-gold text-midnight px-8 py-4 rounded-sm border-2 border-gold-light/20 font-extrabold text-[11px] uppercase tracking-widest hover:bg-gold-light transition-all shadow-hard flex items-center gap-3 italic"
              >
                <span>NEW_CASE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            <AnimatePresence>
              {filteredCases.length > 0 ? (
                filteredCases.map((c, i) => {
                  const date = new Date(c.timestamp).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  const msgCount = c.messages?.length || 0;
                  const jurisdiction = c.analysis?.jurisdiction || 'National';

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      key={c.id}
                      onClick={() => navigate('/chat', { state: { loadCaseId: c.id } })}
                      className="group bg-void border-2 border-white/5 hover:border-gold/30 rounded-sm p-6 cursor-pointer transition-all shadow-hard relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-display font-bold uppercase text-white group-hover:text-gold transition-colors italic">
                            {c.title || 'Untitled Consultation'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-2 text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                              <Calendar className="w-3.5 h-3.5" />
                              {date}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {msgCount} Exchange{msgCount !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                              <Scale className="w-3.5 h-3.5" />
                              Jurisdiction: {jurisdiction}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                           {c.analysis && (
                            <span className="px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[9px] uppercase font-bold tracking-widest rounded shadow-inner">
                              Analysis Complete
                            </span>
                           )}
                           <button
                            onClick={(e) => handleDelete(c.id, e)}
                            className="p-3 rounded-sm text-text-tertiary hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-32 px-6 border-2 border-dashed border-white/10 rounded-sm">
                  <FileText className="w-12 h-12 text-text-tertiary opacity-40 mx-auto mb-6" />
                  <h3 className="text-xl font-display text-white uppercase italic tracking-tighter mb-2">
                    No Records Found
                  </h3>
                  <p className="text-sm text-text-tertiary font-body italic">
                    {searchQuery ? "No matches for your search." : "Your consultation history is currently empty."}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
