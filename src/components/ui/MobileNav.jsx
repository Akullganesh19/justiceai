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
            className="fixed right-0 top-0 bottom-0 w-[300px] bg-ink border-l border-white/10 z-[91] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center border border-purple/20">
                  <Scale className="w-4 h-4 text-purple" />
                </div>
                <span className="font-display text-lg text-purple font-semibold">JusticeAI</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-raised border border-white/10 hover:border-white/20 transition-colors"
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-purple/10 text-purple border border-purple/20'
                          : 'text-text-secondary hover:bg-void/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple" />}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 space-y-3">
              {/* Keyboard Shortcut Hint */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-void/5 border border-white/10">
                <Command className="w-3.5 h-3.5 text-purple-light" />
                <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                  Cmd+K for quick search
                </span>
              </div>

              {/* Disclaimer */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-raised">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-light flex-shrink-0" />
                <span className="text-[10px] text-text-tertiary font-medium">
                  Information Only • No Legal Advice
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
