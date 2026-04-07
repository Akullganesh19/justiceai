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

function StatCard({ icon: Icon, label, value, suffix = '', color = 'text-red' }) {
  const { count, setRef } = useAnimatedCounter(value);
  return (
    <div
      ref={setRef}
      className="p-8 rounded-3xl bg-void border-2 border-white/5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] transition-all hover:border-red/20 group"
    >
      <div className="w-12 h-12 rounded-xl bg-void/5 border-2 border-white/10 flex items-center justify-center group-hover:border-red/40 transition-all">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className={`text-4xl font-display font-bold ${color} tracking-tight`}>
          {count}
          {suffix}
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary font-extrabold mt-2 border-t border-white/5 pt-2">
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
      className="group w-full text-left p-6 rounded-3xl bg-void border-2 border-white/5 hover:border-red/40 transition-all duration-500 flex items-center gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(225,29,72,0.1)]"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${accent} group-hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight group-hover:text-red transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-tertiary font-body mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-void/5 flex items-center justify-center border-2 border-white/10 group-hover:bg-red group-hover:border-red transition-all">
        <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-white" />
      </div>
    </button>
  );
}

function RecentCaseCard({ caseData }) {
  const navigate = useNavigate();
  const title = caseData.title || 'Unknown Case Sequence';
  const date = new Date(caseData.timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const msgCount = caseData.messages?.length || 0;

  return (
    <button
      onClick={() => navigate('/chat')}
      className="group w-full text-left p-6 rounded-2xl bg-void border-2 border-white/5 hover:border-blue/40 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,0.1)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white uppercase tracking-widest truncate group-hover:text-blue transition-colors">
            {title}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[9px] text-text-tertiary font-extrabold uppercase tracking-widest bg-void/5 px-2 py-0.5 rounded border border-white/10">
              {date}
            </span>
            <span className="text-[9px] text-blue font-extrabold uppercase tracking-widest">
              {msgCount} Log Entries
            </span>
          </div>
        </div>
        {caseData.analysis && (
          <div className="flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-widest text-accent-success bg-accent-success/10 px-2 py-1 rounded border border-accent-success/30">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse" />
            Verified
          </div>
        )}
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
      setGreeting('System Online');
      setGreetIcon(Sunrise);
    } else if (hour < 17) {
      setGreeting('Legal Terminal Active');
      setGreetIcon(Sun);
    } else {
      setGreeting('Secure Session');
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
      title: 'Start Legal Case',
      description: 'Launch Core Analysis Engine',
      path: '/chat',
      accent: 'bg-red/10 border-red/20 text-red',
    },
    {
      icon: FileText,
      title: 'Draft Documents',
      description: 'Notices, RTI, & Complaints',
      path: '/documents',
      accent: 'bg-blue/10 border-blue/20 text-blue',
    },
    {
      icon: BookOpen,
      title: 'Legal Database',
      description: 'Search Rights & Statutes',
      path: '/rights',
      accent: 'bg-red/10 border-red/20 text-red',
    },
    {
      icon: Calculator,
      title: 'Fee Estimator',
      description: 'Court & Advocate Costs',
      path: '/estimator',
      accent: 'bg-blue/10 border-blue/20 text-blue',
    },
  ];

  const secondaryActions = [
    { icon: UserCheck, title: 'Advocate Network', path: '/lawyers' },
    { icon: Milestone, title: 'Case Tracker', path: '/tracker' },
    { icon: Brain, title: 'Knowledge Quiz', path: '/quiz' },
    { icon: BookMarked, title: 'Glossary', path: '/glossary' },
    { icon: Clock, title: 'Deadlines', path: '/limitation' },
    { icon: HeartHandshake, title: 'Legal Aid', path: '/legal-aid' },
  ];

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* Background Effects */}
      <div className="aurora-effect">
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
      </div>
      <div className="grain-overlay pointer-events-none" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-12 border-b-2 border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red/10 border-2 border-red/20 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)]">
                  <GreetIcon className="w-6 h-6 text-red" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-red-light block mb-1">
                    Status: Active
                  </span>
                  <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight text-white leading-none">
                    {greeting}
                  </h1>
                </div>
              </div>
              <p className="text-text-secondary font-body text-lg max-w-xl border-l-2 border-red/20 pl-6 ml-6">
                Operational dashboard for the JusticeAI Legal Co-pilot. Command terminal for Indian
                citizens.
              </p>
            </div>

            <button
              onClick={() => navigate('/chat')}
              className="group bg-red text-white px-10 py-5 rounded-xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-red-dark transition-all active:translate-x-[2px] active:translate-y-[2px] shadow-[8px_8px_0px_0px_rgba(159,18,57,1)] flex items-center gap-3"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Launch Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Core Analytics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Scale} label="Acts Monitored" value={42} suffix="+" color="text-red" />
            <StatCard
              icon={Shield}
              label="Verified Rights"
              value={18}
              suffix="+"
              color="text-blue"
            />
            <StatCard icon={Milestone} label="System Templates" value={12} color="text-red" />
            <StatCard
              icon={TrendingUp}
              label="Cases Processed"
              value={recentCases.length}
              color="text-blue"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Primary Command Modules */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between border-b-2 border-white/5 pb-4">
                <h2 className="text-xl font-display font-bold uppercase tracking-widest text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-red rounded-full" />
                  Primary Modules
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {quickActions.map((action, i) => (
                  <QuickActionCard key={i} {...action} />
                ))}
              </div>

              {/* Secondary Navigation Grid */}
              <div className="pt-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {secondaryActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(action.path)}
                      className="group p-4 rounded-xl bg-void border-2 border-white/5 hover:border-red/20 transition-all text-left space-y-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-void/5 flex items-center justify-center border-2 border-white/10 group-hover:bg-red/10 group-hover:border-red/40 transition-all">
                        <action.icon className="w-4 h-4 text-text-tertiary group-hover:text-red transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary group-hover:text-white transition-colors">
                        {action.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Terminal: Recent Activity */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b-2 border-white/5 pb-4">
                <h2 className="text-xl font-display font-bold uppercase tracking-widest text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue rounded-full" />
                  Execution Logs
                </h2>
                <button
                  onClick={() => navigate('/chat')}
                  className="text-[10px] uppercase tracking-widest text-blue font-extrabold hover:text-blue-light transition-colors"
                >
                  History →
                </button>
              </div>

              <div className="space-y-4">
                {recentCases.length > 0 ? (
                  recentCases.map((c, i) => <RecentCaseCard key={c.id || i} caseData={c} />)
                ) : (
                  <div className="p-10 rounded-3xl bg-void border-2 border-white/5 text-center space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="w-16 h-16 rounded-2xl bg-red/5 border-2 border-red/10 flex items-center justify-center mx-auto">
                      <MessageSquare className="w-8 h-8 text-red/40" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-widest text-text-tertiary">
                        No Active Logs
                      </p>
                      <p className="text-xs text-text-tertiary font-body leading-relaxed opacity-60">
                        Initiate a case sequence via the AI Engine to begin documentation.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/chat')}
                      className="text-xs uppercase font-extrabold tracking-widest text-red hover:text-red-light transition-colors border-b-2 border-red/30 pb-1"
                    >
                      Initialize System →
                    </button>
                  </div>
                )}
              </div>

              {/* Tactical Briefing Card */}
              <div className="p-8 rounded-3xl bg-void border-2 border-blue/20 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(37,99,235,0.05)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue/5 blur-3xl rounded-full" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-blue-light font-extrabold">
                      Citizen Briefing
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary font-body leading-relaxed border-l-2 border-blue/40 pl-4 py-1">
                    Under <strong className="text-white">Section 12 (CP Act 2019)</strong>, online
                    filing is mandatory for disputes above ₹50 Lakhs. Use{' '}
                    <span className="text-blue">ediakhil.nic.in</span> for direct oversight.
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
