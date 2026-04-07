import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  BookOpen,
  Calculator,
  UserCheck,
  Milestone,
  Brain,
  Scale,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Shield,
  Sunrise,
  Sun,
  Moon,
  ChevronRight,
  HeartHandshake,
  BookMarked,
  AlertCircle,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

// Animated counter hook
function useAnimatedCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [target, duration, ref]);

  return { count, setRef };
}

function StatCard({ icon: Icon, label, value, suffix = '', color = 'text-gold' }) {
  const { count, setRef } = useAnimatedCounter(value);
  return (
    <div
      ref={setRef}
      className="p-8 rounded-sm bg-void border-2 border-white/5 space-y-4 shadow-hard transition-all hover:border-gold/20 group"
    >
      <div className="w-12 h-12 rounded bg-void border-2 border-white/10 flex items-center justify-center group-hover:border-gold transition-all shadow-luxe">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className={`text-4xl font-display font-bold ${color} tracking-tight`}>
          {count}
          {suffix}
        </p>
        <p className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold mt-2 border-t border-white/5 pt-2 opacity-60">
          {label}
        </p>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, path, accent }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="group w-full text-left p-8 rounded-sm bg-void border-2 border-white/5 hover:border-gold/40 transition-all duration-500 flex items-center gap-6 shadow-hard hover:translate-y-[-4px]"
    >
      <div
        className={`w-16 h-16 rounded bg-void flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${accent} group-hover:scale-110 shadow-luxe`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight group-hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-tertiary font-body mt-1 leading-relaxed opacity-70">{description}</p>
      </div>
      <div className="w-10 h-10 rounded-sm bg-void flex items-center justify-center border-2 border-white/10 group-hover:bg-gold group-hover:border-gold transition-all group-hover:shadow-luxe">
        <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-midnight" />
      </div>
    </button>
  );
}

function RecentCaseCard({ caseData }) {
  const navigate = useNavigate();
  const title = caseData.title || 'Untitled Consultation';
  const date = new Date(caseData.timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const msgCount = caseData.messages?.length || 0;

  return (
    <button
      onClick={() => navigate('/chat')}
      className="group w-full text-left p-6 rounded-sm bg-void border-2 border-white/5 hover:border-gold/30 transition-all duration-300 shadow-hard"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white uppercase tracking-widest truncate group-hover:text-gold transition-colors">
            {title}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {date}
            </span>
            <span className="text-[9px] text-gold font-bold uppercase tracking-widest">
              {msgCount} Exchange{msgCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
          <div className="flex items-center gap-1.5 text-[9px] uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-400/5 px-2.5 py-1 rounded-sm border-2 border-emerald-400/20 shadow-hard">
            <div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 animate-pulse" />
            Analyzed
          </div>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [recentCases, setRecentCases] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [greetIcon, setGreetIcon] = useState(Sun);

  useEffect(() => {
    const saved = localStorage.getItem('justice_ai_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentCases(parsed.slice(0, 5));
      } catch (e) {}
    }

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Welcome Back');
      setGreetIcon(Sunrise);
    } else if (hour < 17) {
      setGreeting('Afternoon Session');
      setGreetIcon(Sun);
    } else {
      setGreeting('Good Evening');
      setGreetIcon(Moon);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const GreetIcon = greetIcon;

  const quickActions = [
    {
      icon: MessageSquare,
      title: 'New Case',
      description: 'Start a high-intelligence legal consultation',
      path: '/chat',
      accent: 'bg-gold/10 border-gold/20 text-gold',
    },
    {
      icon: FileText,
      title: 'Draft Documents',
      description: 'Generate notices, applications, and complaints',
      path: '/documents',
      accent: 'bg-gold/10 border-gold/20 text-gold',
    },
    {
      icon: BookOpen,
      title: 'Rights Explorer',
      description: 'Detailed analysis of your statutory protections',
      path: '/rights',
      accent: 'bg-gold/10 border-gold/20 text-gold',
    },
    {
      icon: Calculator,
      title: 'Cost Estimator',
      description: 'Forecast institutional and professional legal fees',
      path: '/estimator',
      accent: 'bg-gold/10 border-gold/20 text-gold',
    },
  ];

  const secondaryActions = [
    { icon: UserCheck, title: 'Advocate Search', path: '/lawyers' },
    { icon: Milestone, title: 'Case Tracker', path: '/tracker' },
    { icon: Brain, title: 'Legal Academy', path: '/quiz' },
    { icon: BookMarked, title: 'Terms Glossary', path: '/glossary' },
    { icon: Clock, title: 'Deadline Hub', path: '/limitation' },
    { icon: HeartHandshake, title: 'Legal Aid Support', path: '/legal-aid' },
  ];

  return (
    <div className="min-h-screen bg-void relative overflow-hidden font-mono text-slate-200">
      {/* Background Effects */}
      <div className="aurora-effect">
        <div className="aurora-blob bg-gold/5 opacity-20"></div>
        <div className="aurora-blob bg-blue-500/5 opacity-10"></div>
        <div className="aurora-blob bg-gold/5 opacity-10"></div>
      </div>
      <div className="grain-overlay pointer-events-none opacity-[0.03]" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 pb-16 border-b border-white/5">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-14 h-14 rounded-sm bg-gold/5 border-2 border-gold/20 flex items-center justify-center shadow-luxe">
                  <GreetIcon className="w-7 h-7 text-gold" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
                    System Verified
                  </span>
                  <h1 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tighter text-white leading-none italic">
                    {greeting === 'Welcome Back' ? 'SYSTEM_REINIT' : greeting.toUpperCase().replace(' ', '_')}
                  </h1>
                </div>
              </div>
              <p className="text-text-tertiary font-body text-lg max-w-xl border-l-2 border-gold/20 pl-8 mx-auto md:mx-0 opacity-80">
                Welcome to your comprehensive legal dashboard. Access intelligence modules, manage active cases, and explore your statutory rights.
              </p>
            </div>

            <button
              onClick={() => navigate('/chat')}
              className="group bg-gold text-midnight px-12 py-6 rounded-sm border-2 border-gold-light/20 font-extrabold text-sm uppercase tracking-widest hover:bg-gold-light transition-all shadow-luxe flex items-center gap-4 italic"
            >
              <Sparkles className="w-5 h-5" />
              <span>INITIALIZE_CONSULTATION</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Key Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={Scale} label="Statutory Hubs" value={45} suffix="+" color="text-gold" />
            <StatCard
              icon={Shield}
              label="Verified Protections"
              value={20}
              suffix="+"
              color="text-gold"
            />
            <StatCard icon={Milestone} label="Drafting Templates" value={15} color="text-gold" />
            <StatCard
              icon={TrendingUp}
              label="Total Engagements"
              value={recentCases.length}
              color="text-gold"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* Core Capabilities Module */}
            <div className="lg:col-span-2 space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-4">
                  <div className="w-2 h-8 bg-gold shadow-luxe" />
                  CAPABILITY_TERMINALS
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                {quickActions.map((action, i) => (
                  <QuickActionCard key={i} {...action} />
                ))}
              </div>

              {/* Auxiliary Services Grid */}
              <div className="pt-12">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {secondaryActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(action.path)}
                      className="group p-6 rounded-sm bg-void border-2 border-white/5 hover:border-gold/30 transition-all text-left space-y-4 hover:translate-y-[-2px] hover:shadow-hard"
                    >
                      <div className="w-10 h-10 rounded-sm bg-void flex items-center justify-center border-2 border-white/10 group-hover:bg-gold group-hover:border-gold transition-all shadow-luxe">
                        <action.icon className="w-5 h-5 text-text-tertiary group-hover:text-midnight transition-colors" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary group-hover:text-white transition-colors">
                        {action.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Terminal: Activity & Insight */}
            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-4">
                  <div className="w-2 h-8 bg-gold shadow-luxe" />
                  INTELLIGENCE_RECORDS
                </h2>
              </div>

              <div className="space-y-6">
                {recentCases.length > 0 ? (
                  recentCases.map((c, i) => <RecentCaseCard key={c.id || i} caseData={c} />)
                ) : (
                  <div className="p-12 rounded-sm bg-void border-2 border-white/5 text-center space-y-8 shadow-hard">
                    <div className="w-16 h-16 rounded-sm bg-white/5 border-2 border-white/10 flex items-center justify-center mx-auto opacity-20">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-widest text-text-tertiary">
                        No Recent Activity
                      </p>
                      <p className="text-xs text-text-tertiary font-body leading-relaxed opacity-40 italic">
                        Start a new consultation to begin your case records.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/chat')}
                      className="text-xs uppercase font-bold tracking-widest text-gold hover:text-gold-light transition-colors border-b border-gold/30 pb-1"
                    >
                      Get Started →
                    </button>
                  </div>
                )}
              </div>

              {/* Legal Insight Card */}
              <div className="p-10 rounded-sm bg-void border-2 border-gold/20 relative overflow-hidden shadow-hard group/insight">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-3xl rounded-full opacity-50 group-hover/insight:bg-blue-400/10 transition-all" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-gold" />
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                      STRATEGIC_INSIGHT
                    </span>
                  </div>
                  <p className="text-sm text-text-tertiary font-body leading-relaxed border-l-4 border-gold/30 pl-6 py-2 opacity-80 italic">
                    Under <strong className="text-white">Section 12 (CP Act 2019)</strong>, e-filing is mandated for disputes above ₹50 Lakhs. Consult official portals for direct submission guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
