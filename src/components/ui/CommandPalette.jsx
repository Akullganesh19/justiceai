import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MessageSquare,
  FileText,
  Scale,
  Calculator,
  ShoppingBag,
  Home,
  Briefcase,
  HelpCircle,
  Info,
  ArrowRight,
  Command,
  Play,
  Plus,
  Sword,
  ShieldCheck,
  BookOpen,
  Shield,
  UserCheck,
  Milestone,
  Brain,
  LayoutDashboard,
  BookMarked,
  Clock,
  HeartHandshake,
} from 'lucide-react';

const ALL_COMMANDS = [
  // Navigation
  { id: 'nav-home', label: 'Go to Home', group: 'Navigate', icon: Home, action: '/' },
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    group: 'Navigate',
    icon: LayoutDashboard,
    action: '/dashboard',
    description: 'Your legal command center',
  },
  {
    id: 'nav-chat',
    label: 'Open Legal Chat',
    group: 'Navigate',
    icon: MessageSquare,
    action: '/chat',
  },
  {
    id: 'nav-documents',
    label: 'Document Generator',
    group: 'Navigate',
    icon: FileText,
    action: '/documents',
  },
  {
    id: 'nav-rights',
    label: 'Know Your Rights',
    group: 'Navigate',
    icon: BookOpen,
    action: '/rights',
  },
  {
    id: 'nav-estimator',
    label: 'Cost Estimator',
    group: 'Navigate',
    icon: Calculator,
    action: '/estimator',
  },
  {
    id: 'nav-lawyers',
    label: 'LOCATE_ADVOCATE',
    group: 'Navigate',
    icon: UserCheck,
    action: '/lawyers',
  },
  {
    id: 'nav-tracker',
    label: 'Case Tracker',
    group: 'Navigate',
    icon: Milestone,
    action: '/tracker',
  },
  { id: 'nav-quiz', label: 'Legal Quiz', group: 'Navigate', icon: Brain, action: '/quiz' },
  {
    id: 'nav-glossary',
    label: 'Legal Glossary',
    group: 'Navigate',
    icon: BookMarked,
    action: '/glossary',
    description: 'Search legal terminology',
  },
  {
    id: 'nav-limitation',
    label: 'Limitation Calculator',
    group: 'Navigate',
    icon: Clock,
    action: '/limitation',
    description: 'Filing deadline calculator',
  },
  {
    id: 'nav-legalaid',
    label: 'Legal Aid Checker',
    group: 'Navigate',
    icon: HeartHandshake,
    action: '/legal-aid',
    description: 'Check free legal aid eligibility',
  },
  { id: 'nav-samples', label: 'Sample Cases', group: 'Navigate', icon: Play, action: '/samples' },
  { id: 'nav-faq', label: 'FAQ', group: 'Navigate', icon: HelpCircle, action: '/faq' },
  { id: 'nav-about', label: 'About JusticeAI', group: 'Navigate', icon: Info, action: '/about' },

  // Quick Actions
  {
    id: 'act-new-case',
    label: 'Start New Case',
    group: 'Quick Actions',
    icon: Plus,
    action: '/chat',
    description: 'Begin a fresh legal analysis',
  },
  {
    id: 'act-consumer',
    label: 'Consumer Rights Demo',
    group: 'Quick Actions',
    icon: ShoppingBag,
    action: '/samples',
    description: 'Launch consumer complaint sample',
  },
  {
    id: 'act-tenant',
    label: 'Tenant Dispute Demo',
    group: 'Quick Actions',
    icon: Home,
    action: '/samples',
    description: 'Launch tenant rights sample',
  },
  {
    id: 'act-workplace',
    label: 'Workplace Issue Demo',
    group: 'Quick Actions',
    icon: Briefcase,
    action: '/samples',
    description: 'Launch wrongful termination sample',
  },

  // Tools
  {
    id: 'tool-legal-notice',
    label: 'Generate Legal Notice',
    group: 'Tools',
    icon: FileText,
    action: '/documents',
    description: 'Create a formal legal notice',
  },
  {
    id: 'tool-rti',
    label: 'Generate RTI Application',
    group: 'Tools',
    icon: Shield,
    action: '/documents',
    description: 'Create an RTI request',
  },
  {
    id: 'tool-cost',
    label: 'Estimate Legal Costs',
    group: 'Tools',
    icon: Calculator,
    action: '/estimator',
    description: 'Calculate court fees and lawyer costs',
  },
  {
    id: 'tool-glossary-search',
    label: 'Search Legal Terms',
    group: 'Tools',
    icon: BookMarked,
    action: '/glossary',
    description: 'Look up any legal term or jargon',
  },
  {
    id: 'tool-deadline',
    label: 'Check Filing Deadline',
    group: 'Tools',
    icon: Clock,
    action: '/limitation',
    description: 'Never miss a limitation period',
  },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Handle Cmd/Ctrl + K, or the '/' key
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery('');
        setActiveIndex(0);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return ALL_COMMANDS;
    const q = query.toLowerCase();
    return ALL_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.group.toLowerCase().includes(q) ||
        cmd.description?.toLowerCase().includes(q),
    );
  }, [query]);

  // Group commands
  const groupedCommands = useMemo(() => {
    const groups = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleNav = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && filteredCommands[activeIndex]) {
        e.preventDefault();
        handleSelect(filteredCommands[activeIndex]);
      }
    };
    document.addEventListener('keydown', handleNav);
    return () => document.removeEventListener('keydown', handleNav);
  }, [isOpen, activeIndex, filteredCommands]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleSelect = (cmd) => {
    setIsOpen(false);
    setQuery('');
    navigate(cmd.action);
  };

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101]"
          >
            <div className="mx-4 bg-ink border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 border-b border-white/5">
                <Search className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH_REGISTRY_DATABASE..."
                  className="flex-1 bg-transparent py-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-body"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-void/5 border border-white/10 text-[10px] text-text-tertiary font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2 custom-scrollbar">
                {filteredCommands.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-text-tertiary font-body">
                      No results found for "{query}"
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([groupName, commands]) => (
                    <div key={groupName}>
                      <p className="px-5 py-2 text-[9px] uppercase tracking-[0.2em] font-extrabold text-text-tertiary">
                        {groupName}
                      </p>
                      {commands.map((cmd) => {
                        flatIndex++;
                        const currentIndex = flatIndex;
                        const Icon = cmd.icon;
                        const isActive = currentIndex === activeIndex;
                        return (
                          <button
                            key={cmd.id}
                            data-index={currentIndex}
                            onClick={() => handleSelect(cmd)}
                            onMouseEnter={() => setActiveIndex(currentIndex)}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                              isActive ? 'bg-purple/10' : 'hover:bg-void/[0.03]'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isActive
                                  ? 'bg-purple/20 text-purple'
                                  : 'bg-void/5 text-text-tertiary'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${isActive ? 'text-purple' : 'text-text-primary'}`}
                              >
                                {cmd.label}
                              </p>
                              {cmd.description && (
                                <p className="text-[11px] text-text-tertiary truncate">
                                  {cmd.description}
                                </p>
                              )}
                            </div>
                            {isActive && (
                              <ArrowRight className="w-4 h-4 text-purple flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                    <kbd className="px-1.5 py-0.5 rounded bg-void/5 border border-white/10 font-mono">
                      ↑↓
                    </kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                    <kbd className="px-1.5 py-0.5 rounded bg-void/5 border border-white/10 font-mono">
                      ↵
                    </kbd>
                    select
                  </span>
                </div>
                <span className="text-[9px] text-text-tertiary uppercase tracking-widest font-bold">
                  JusticeAI
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
