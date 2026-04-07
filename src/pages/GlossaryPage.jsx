import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookMarked,
  Scale,
  Milestone,
  Building2,
  Briefcase,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Hash,
  Users,
  ShoppingBag,
  Globe,
  Cpu,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { GLOSSARY_TERMS } from '../data/legalGlossaryData';

const CATEGORIES = [
  { id: 'all', label: 'All Terms', icon: BookMarked },
  { id: 'constitutional', label: 'Constitutional', icon: Scale },
  { id: 'criminal', label: 'Criminal', icon: Milestone },
  { id: 'civil', label: 'Civil', icon: Building2 },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'corporate', label: 'Corporate', icon: Briefcase },
  { id: 'consumer', label: 'Consumer', icon: ShoppingBag },
  { id: 'procedural', label: 'Procedural', icon: Shield },
  { id: 'latin_maxim', label: 'Latin Maxims', icon: Globe },
  { id: 'digital_law', label: 'Digital Law', icon: Cpu },
];

function TermCard({ term, isExpanded, onToggle }) {
  const firstLetter = term.term.charAt(0).toUpperCase();

  return (
    <motion.div
      layout
      className="bg-void rounded border-2 border-white/5 overflow-hidden hover:border-red/40 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] group"
    >
      <button onClick={onToggle} className="w-full text-left p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded bg-void border-2 border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-red/40 transition-all">
          <span className="text-xl font-display font-bold text-white opacity-40 group-hover:text-red transition-all italic">
            {firstLetter}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[9px] uppercase tracking-[0.3em] text-red font-extrabold px-3 py-1 bg-red/10 rounded border-2 border-red/20 italic">
              {term.category}
            </span>
          </div>
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-tighter italic leading-snug">
            {term.term}
          </h3>
        </div>
        <div
          className={`p-2 rounded border-2 transition-all flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] ${isExpanded ? 'bg-red border-red text-white' : 'bg-void border-white/10 text-white/20'}`}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6 border-t-2 border-white/5 pt-6 ml-16">
              <p className="text-[13px] text-text-tertiary leading-relaxed font-body uppercase tracking-wider italic opacity-80">
                {term.definition}
              </p>

              {/* Legal Reference */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-red italic opacity-60">
                  <Scale className="w-4 h-4" />
                  STATUTORY_REFERENCE_INDEX
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[11px] px-4 py-2 bg-void text-white rounded border-2 border-white/10 font-mono tracking-tighter shadow-inner italic">
                    {term.reference}
                  </span>
                  {term.bnsEquivalent && (
                    <span className="text-[11px] px-4 py-2 bg-red text-white rounded border-2 border-red-light/20 font-mono font-extrabold flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(159,18,57,0.3)] italic">
                      <Hash className="w-3 h-3" />
                      BNS_UPDATE: {term.bnsEquivalent}
                    </span>
                  )}
                </div>
              </div>

              {/* Related Terms */}
              {term.related && term.related.length > 0 && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-blue italic opacity-60">
                    <ArrowRight className="w-4 h-4" />
                    ASSOCIATED_MANDATES
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {term.related.map((r, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-4 py-2 bg-void text-blue rounded border-2 border-blue/20 font-display font-bold uppercase tracking-widest italic hover:border-blue/50 transition-colors shadow-sm"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GlossaryPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredTerms = useMemo(() => {
    let results = GLOSSARY_TERMS;
    if (activeCategory !== 'all') {
      results = results.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q) ||
          t.related?.some((r) => r.toLowerCase().includes(q)),
      );
    }
    return results.sort((a, b) => a.term.localeCompare(b.term));
  }, [activeCategory, searchQuery]);

  // Group by first letter for alphabet nav
  const letterGroups = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((t) => {
      const letter = t.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return groups;
  }, [filteredTerms]);

  return (
    <div className="min-h-screen bg-void pb-32">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-32 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-red/10 text-red-light text-[10px] uppercase font-extrabold tracking-[0.4em] rounded border-2 border-red/20 shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)] font-display italic">
            <BookMarked className="w-4 h-4" />
            <span>Statutory_Lexicon_Repository</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none">
            Legal <span className="text-red italic">Glossary</span>
          </h1>
          <p className="text-lg text-text-tertiary leading-relaxed max-w-2xl mx-auto font-body uppercase tracking-wider italic">
            Searchable repository of {GLOSSARY_TERMS.length}+ essential Indian legal mandates.
            Decrypting the standard procedural terminology.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-hover:text-red transition-all" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_INDEX_REPOSITORIES..."
              className="w-full bg-void border-2 border-white/5 rounded px-16 py-5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red/40 transition-all font-display font-bold tracking-widest uppercase italic shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] shadow-inner"
            />
            {searchQuery && (
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-red font-extrabold uppercase tracking-[0.2em] italic">
                {filteredTerms.length} HITS
              </span>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count =
              cat.id === 'all'
                ? GLOSSARY_TERMS.length
                : GLOSSARY_TERMS.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedId(null);
                }}
                className={`flex items-center gap-3 px-5 py-2.5 rounded border-2 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[1px] active:translate-y-[1px] italic ${
                  isActive
                    ? 'bg-red border-red text-white shadow-[6px_6px_0px_0px_rgba(159,18,57,0.3)]'
                    : 'bg-void border-white/10 text-white/40 hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded border ${isActive ? 'bg-void/20 border-white/30 text-white' : 'bg-void border-white/5 text-white/20'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alphabet Quick-Jump */}
        <div className="flex flex-wrap justify-center gap-2">
          {Object.keys(letterGroups)
            .sort()
            .map((letter) => (
              <a
                key={letter}
                href={`#glossary-${letter}`}
                className="w-10 h-10 rounded bg-void border-2 border-white/5 hover:border-red/60 hover:text-red flex items-center justify-center text-sm font-display font-bold text-white/20 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {letter}
              </a>
            ))}
        </div>

        {/* Terms List grouped by letter */}
        <div className="space-y-8">
          {Object.entries(letterGroups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, terms]) => (
              <div key={letter} id={`glossary-${letter}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded bg-red text-white border-2 border-red-light/20 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(159,18,57,0.3)]">
                    <span className="text-lg font-display font-bold italic">{letter}</span>
                  </div>
                  <div className="flex-1 h-[2px] bg-void/5 shadow-inner" />
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-extrabold italic">
                    {terms.length} NODES_INDEXED
                  </span>
                </div>
                <div className="grid gap-3">
                  {terms.map((term) => (
                    <TermCard
                      key={term.id}
                      term={term}
                      isExpanded={expandedId === term.id}
                      onToggle={() => setExpandedId(expandedId === term.id ? null : term.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

          {filteredTerms.length === 0 && (
            <div className="text-center py-24 space-y-8 bg-void rounded border-2 border-dashed border-white/10 shadow-inner">
              <Search className="w-16 h-16 text-white/10 mx-auto" />
              <div className="space-y-2">
                <p className="text-xl font-display font-bold text-white uppercase tracking-tighter italic">
                  ZERO_RESULTS_FETCHED
                </p>
                <p className="text-xs text-text-tertiary uppercase tracking-[0.4em] italic opacity-60">
                  THE REQUESTED TERM DOES NOT EXIST IN LOCAL STATUTORY RECORDS.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-8 py-4 rounded border-2 border-white/10 text-white/60 text-[11px] font-extrabold uppercase tracking-widest hover:text-white hover:border-white/30 transition-all italic shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  PURGE_FILTERS
                </button>
                <button
                  onClick={() =>
                    navigate('/chat', {
                      state: {
                        sampleCase: `Define "${searchQuery}" under Indian law, citing the relevant Act or section where applicable.`,
                        caseType: 'Legal Definition',
                      },
                    })
                  }
                  className="px-8 py-4 rounded bg-red text-white text-[11px] font-extrabold uppercase tracking-widest hover:bg-red-dark transition-all flex items-center gap-3 italic shadow-[6px_6px_0px_0px_rgba(159,18,57,0.4)]"
                >
                  <BookMarked className="w-4 h-4 shrink-0" />
                  CONSULT_AI_ORACLE
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
