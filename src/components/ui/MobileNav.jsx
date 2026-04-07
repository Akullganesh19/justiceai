import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  MessageSquare,
  FileText,
  BookOpen,
  Calculator,
  Play,
  HelpCircle,
  Info,
  Home,
  Scale,
  ShieldCheck,
  Command,
  UserCheck,
  Milestone,
  Brain,
  LayoutDashboard,
  BookMarked,
  Clock,
  HeartHandshake,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chat', label: 'Legal Chat', icon: MessageSquare },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/rights', label: 'Know Your Rights', icon: BookOpen },
  { path: '/estimator', label: 'Cost Estimator', icon: Calculator },
  { path: '/lawyers', label: 'LOCATE_ADVOCATE', icon: UserCheck },
  { path: '/tracker', label: 'Case Tracker', icon: Milestone },
  { path: '/quiz', label: 'Legal Quiz', icon: Brain },
  { path: '/glossary', label: 'Legal Glossary', icon: BookMarked },
  { path: '/limitation', label: 'Deadline Calculator', icon: Clock },
  { path: '/legal-aid', label: 'Legal Aid Check', icon: HeartHandshake },
  { path: '/samples', label: 'Sample Cases', icon: Play },
  { path: '/faq', label: 'FAQ', icon: HelpCircle },
  { path: '/about', label: 'About', icon: Info },
];

export default function MobileNav({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-void border-l-2 border-white/5 z-[91] flex flex-col font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-gold/10 flex items-center justify-center border-2 border-gold/20 shadow-luxe">
                  <Scale className="w-4 h-4 text-gold" />
                </div>
                <span className="font-display text-lg text-white font-bold uppercase tracking-tighter italic">JUSTICE<span className="text-gold">AI</span></span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-sm bg-void border-2 border-white/5 hover:border-gold/40 transition-all shadow-hard"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
              {NAV_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] uppercase font-extrabold tracking-widest transition-all italic border-2 ${
                      isActive
                        ? 'bg-gold border-gold text-midnight shadow-luxe'
                        : 'text-text-secondary hover:bg-white/5 hover:text-white border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-midnight" />}
                  </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 space-y-3">
              {/* Keyboard Shortcut Hint */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-sm bg-void border-2 border-white/5 shadow-hard italic">
                <Command className="w-4 h-4 text-gold" />
                <span className="text-[9px] text-text-tertiary font-extrabold uppercase tracking-widest">
                  CMD+K_SEARCH_TERMINAL
                </span>
              </div>

              {/* Disclaimer */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-sm bg-void border-2 border-gold/10 shadow-hard italic">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-[9px] text-text-tertiary font-extrabold uppercase tracking-widest">
                  INFORMATION_ONLY_V4.2
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
