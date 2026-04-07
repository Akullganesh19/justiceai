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
      className="bg-void rounded-sm border-2 border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-500 shadow-hard group"
    >
      <button onClick={onToggle} className="w-full text-left p-8 flex items-center gap-6">
        <div className="w-14 h-14 rounded-sm bg-void border-2 border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-gold/40 transition-all shadow-hard">
          <span className="text-2xl font-display font-bold text-white opacity-20 group-hover:text-gold transition-all group-hover:opacity-100">
            {firstLetter}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-extrabold px-3 py-1 bg-gold/5 rounded-sm border-2 border-gold/20 italic">
              {term.category}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tighter uppercase italic group-hover:text-gold transition-colors">
            {term.term}
          </h3>
        </div>
        <div
          className={`w-10 h-10 rounded-sm border-2 transition-all flex-shrink-0 flex items-center justify-center shadow-hard ${isExpanded ? 'bg-gold border-gold text-midnight' : 'bg-void border-white/5 text-white/20'}`}
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
            <div className="px-8 pb-8 space-y-8 border-t border-white/5 pt-8 ml-0 md:ml-20">
              <p className="text-[14px] text-text-tertiary leading-relaxed font-body uppercase tracking-wider italic opacity-80 border-l-4 border-gold/20 pl-6">
                {term.definition}
              </p>

              {/* Legal Reference */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-gold opacity-60 italic">
                  <Scale className="w-4 h-4" />
                  Statutory Reference
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[10px] px-5 py-2.5 bg-void text-white rounded-sm border-2 border-white/5 font-extrabold uppercase tracking-widest italic shadow-hard">
                    {term.reference}
                  </span>
                  {term.bnsEquivalent && (
                    <span className="text-[10px] px-5 py-2.5 bg-gold text-midnight rounded-sm border-2 border-gold/40 font-extrabold uppercase tracking-widest italic flex items-center gap-2 shadow-hard">
                      <Hash className="w-3 h-3" />
                      BNS_PROVISION: {term.bnsEquivalent}
                    </span>
                  )}
                </div>
              </div>

              {/* Related Terms */}
              {term.related && term.related.length > 0 && (
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-gold opacity-60 italic">
                    <ArrowRight className="w-4 h-4" />
                    Related Terms
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {term.related.map((r, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-4 py-2 bg-void border-2 border-blue/20 text-gold rounded-sm font-extrabold uppercase tracking-widest italic hover:bg-gold/5 transition-all shadow-sm"
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
    <div className="min-h-screen bg-void pb-32 font-mono">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-32 space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[10px] uppercase font-extrabold tracking-[0.5em] italic rounded-sm shadow-luxe font-display">
            <BookMarked className="w-5 h-5" />
            <span>LEGAL_LEXICON_FRAMEWORK_V1.0</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter leading-none italic text-white text-center">
            LEGAL <span className="text-gold">LEXICON</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.3em] italic opacity-60">
            A COMPREHENSIVE REPOSITORY OF {GLOSSARY_TERMS.length}+ ESSENTIAL LEGAL TERMS. PROVIDING CLARITY ON INDIAN STATUTORY PROVISIONS AND PROCEDURAL STANDARDS.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-hover:text-gold transition-all" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a legal term..."
              className="w-full bg-void border-2 border-white/5 rounded-sm px-16 py-6 text-[13px] font-extrabold uppercase tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-hard italic"
            />
            {searchQuery && (
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-gold font-bold uppercase tracking-widest">
                {filteredTerms.length} Matches
              </span>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-4 no-scrollbar">
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
                className={`flex items-center gap-3 px-6 py-3 rounded-sm border-2 text-[9px] font-extrabold uppercase tracking-widest transition-all italic shadow-hard active:translate-y-[2px] ${
                  isActive
                    ? 'bg-gold border-gold/40 text-midnight'
                    : 'bg-void border-white/5 text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label.replace(' ', '_').toUpperCase()}</span>
                <span
                  className={`text-[8px] px-2 py-0.5 rounded-sm border ${isActive ? 'bg-midnight/20 border-midnight/20 text-midnight' : 'bg-white/5 border-white/5 text-white/20'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alphabet Quick-Jump */}
        <div className="flex flex-wrap justify-center gap-3">
          {Object.keys(letterGroups)
            .sort()
            .map((letter) => (
              <a
                key={letter}
                href={`#glossary-${letter}`}
                className="w-10 h-10 rounded-sm bg-void border-2 border-white/5 hover:border-gold/40 hover:text-gold flex items-center justify-center text-[10px] font-display font-bold text-white/20 transition-all shadow-hard hover:-translate-y-1"
              >
                {letter}
              </a>
            ))}
        </div>

        {/* Terms List grouped by letter */}
        <div className="space-y-12">
          {Object.entries(letterGroups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, terms]) => (
              <div key={letter} id={`glossary-${letter}`}>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-12 h-12 rounded-sm bg-gold text-midnight border-2 border-gold/40 flex items-center justify-center shadow-hard">
                    <span className="text-xl font-display font-extrabold italic">{letter}</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold opacity-30">
                    {terms.length} Terms
                  </span>
                </div>
                <div className="grid gap-4">
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
            <div className="text-center py-24 space-y-10 bg-void border-2 border-dashed border-white/10 shadow-hard">
              <Search className="w-16 h-16 text-white/10 mx-auto" />
              <div className="space-y-4">
                <p className="text-3xl font-display font-bold text-white uppercase tracking-tight">
                  No Results Found
                </p>
                <p className="text-xs text-text-tertiary/40 max-w-lg mx-auto leading-relaxed">
                  The term you are looking for is not in our current statutory records. Try adjusting your search query or consult our AI.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-10 py-5 rounded-sm border-2 border-white/10 text-text-tertiary text-[11px] font-extrabold uppercase tracking-widest hover:text-white hover:border-white/30 transition-all shadow-hard italic"
                >
                  CLEAR_FILTERS
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
                  className="px-10 py-5 rounded-sm bg-gold text-midnight text-[11px] font-extrabold uppercase tracking-widest hover:bg-gold-dark transition-all flex items-center gap-3 shadow-hard italic"
                >
                  <BookMarked className="w-5 h-5" />
                  Ask the AI Consultant
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
