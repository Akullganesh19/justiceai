import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Scale,
  Plus,
  Menu,
  Command,
  LayoutDashboard,
  FileText,
  BookOpen,
  Calculator,
  UserCheck,
  Clock,
  HeartHandshake,
  Milestone,
  MessageSquare,
  Settings2
} from 'lucide-react';
import MobileNav from './MobileNav.jsx';
import CommandPalette from './CommandPalette.jsx';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Chat', icon: MessageSquare },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/rights', label: 'Rights', icon: BookOpen },
  { to: '/estimator', label: 'Estimator', icon: Calculator },
  { to: '/lawyers', label: 'LOCATE_ADVOCATE', icon: UserCheck },
  { to: '/limitation', label: 'Deadlines', icon: Clock },
  { to: '/legal-aid', label: 'Legal Aid', icon: HeartHandshake },
  { to: '/tracker', label: 'Tracker', icon: Milestone },
];

export default function Header({ onNewCase }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Animated gradient border at top */}
        <div className="h-[1px] w-full animated-border" />

        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group magnetic-hover">
            <div className="w-10 h-10 rounded-xl bg-red/10 flex items-center justify-center border-2 border-red/20 group-hover:border-red group-hover:scale-105 transition-all duration-300 neon-glow-red">
              <Scale className="w-5 h-5 text-red" />
            </div>
            <span className="font-display text-2xl text-white font-bold tracking-tight group-hover:text-red transition-colors uppercase text-glow-sm">
              Justice<span className="text-blue">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-void/80 backdrop-blur-xl border-2 border-white/5 p-1 rounded shadow-hard">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} icon={link.icon}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(true)}
              className="p-3 rounded bg-void border-2 border-white/10 text-text-tertiary hover:text-white hover:border-red/40 transition-all group shadow-sm active:translate-y-[1px]"
              title="SEARCH_REGISTRY [CTRL+K] or [/]"
            >
              <Command className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>

            <button
              onClick={onNewCase}
              className="hidden md:flex items-center gap-3 px-6 py-3 bg-red text-white rounded border-2 border-red-light/20 font-extrabold text-[10px] uppercase tracking-[0.3em] hover:bg-red-dark transition-all active:translate-x-[1px] active:translate-y-[1px] shadow-hard-red font-display italic"
            >
              <Plus className="w-4 h-4" />
              <span>NEW_CASE_INIT</span>
            </button>

            <Link
              to="/settings"
              className="p-3 rounded bg-void border-2 border-white/10 text-text-tertiary hover:text-white hover:border-red/40 transition-all group shadow-sm active:translate-y-[1px]"
              title="MODEL_SETTINGS"
            >
              <Settings2 className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 rounded bg-void border-2 border-white/10 text-text-tertiary hover:text-white hover:border-red/40 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette (Cmd+K) */}
      <AnimatePresence>
        {showSearch && <CommandPalette onClose={() => setShowSearch(false)} />}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            links={navLinks}
            activePath={location.pathname}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, children, icon: Icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.2em] transition-all px-4 py-2 rounded border-2 italic ${
        isActive
          ? 'text-white bg-red border-red-light/40 shadow-hard-red'
          : 'text-text-tertiary border-transparent hover:text-white hover:border-white/10'
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </Link>
  );
}
