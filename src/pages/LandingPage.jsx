import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Milestone,
  ShieldCheck,
  FileText,
  ChevronRight,
  BookOpen,
  Calculator,
  MessageSquare,
  ArrowRight,
  Sparkles,
  UserCheck,
  Brain,
  Star,
  Quote,
  Newspaper,
  ExternalLink,
  ChevronLeft,
  LayoutDashboard,
  BookMarked,
  Zap,
  Send,
  Award,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { MorphingCardStack } from '../components/ui/morphing-card-stack';
import MotionGraphics from '../components/ui/MotionGraphics';

// News Ticker Data
const LEGAL_NEWS = [
  {
    id: 1,
    title: 'Supreme Court upholds Right to Privacy in digital surveillance case',
    date: 'Apr 2026',
    tag: 'Constitutional',
  },
  {
    id: 2,
    title: 'New Consumer Protection (E-Commerce) Rules 2026 notified by Govt',
    date: 'Mar 2026',
    tag: 'Consumer',
  },
  {
    id: 3,
    title: 'BNS (Bharatiya Nyaya Sanhita) fully replaces IPC across all states',
    date: 'Mar 2026',
    tag: 'Criminal',
  },
  {
    id: 4,
    title: 'DPDP Act implementation: Data Protection Board starts accepting complaints',
    date: 'Feb 2026',
    tag: 'Digital',
  },
  {
    id: 5,
    title: 'Model Tenancy Act adopted by 18 states — Rent Authority now operational',
    date: 'Feb 2026',
    tag: 'Tenant',
  },
  {
    id: 6,
    title: 'Labour Code on Social Security: Gig workers now covered under ESIC',
    date: 'Jan 2026',
    tag: 'Labour',
  },
  {
    id: 7,
    title: 'Supreme Court: Free legal aid is a fundamental right, not charity',
    date: 'Jan 2026',
    tag: 'Constitutional',
  },
  {
    id: 8,
    title: 'Online FIR system mandatory for all police stations nationwide',
    date: 'Dec 2025',
    tag: 'Criminal',
  },
];

// Testimonials Data
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Adv. S. K. Gupta',
    city: 'New Delhi',
    quote:
      'JusticeAI is an excellent first-referral tool. I used it to quickly draft a consumer notice for a client, saving 2 hours of clerical work.',
    caseType: 'Legal Pro',
    rating: 5,
  },
  {
    id: 2,
    name: 'Meera Deshmukh',
    city: 'Mumbai',
    quote:
      'I was confused about the new BNS sections for a property matter. JusticeAI mapped the old IPC sections to the new 2024 laws perfectly.',
    caseType: 'Property',
    rating: 5,
  },
  {
    id: 3,
    name: 'Amitav Ghosh',
    city: 'Kolkata',
    quote:
      'The Limitation Calculator alerted me that I only had 12 days left to file my MACT claim. Probably saved my case from being time-barred.',
    caseType: 'MACT',
    rating: 5,
  },
  {
    id: 4,
    name: 'Dr. Aruna V.',
    city: 'Chennai',
    quote:
      'As a RTI activist, the automated generator is a blessing. It formats applications exactly as per the 2005 Act requirements.',
    caseType: 'RTI',
    rating: 4,
  },
  {
    id: 5,
    name: 'Karan Singh',
    city: 'Chandigarh',
    quote:
      'I used the Legal Aid Checker to help my building staff find free legal representation. The generated application was accepted by the DLSA.',
    caseType: 'Legal Aid',
    rating: 5,
  },
];function TestimonialCard({ testimonial }) {
  return (
    <div className="flex-shrink-0 w-[340px] md:w-[380px] p-10 rounded-sm bg-void border-2 border-white/5 hover:border-red/40 transition-all duration-500 space-y-8 shadow-hard relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-2 h-full bg-red/10 group-hover:bg-red transition-all" />
      <div className="flex items-center gap-1.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-red fill-red" />
        ))}
      </div>
      <Quote className="w-10 h-10 text-white/5 group-hover:text-red/15 transition-all" />
      <p className="text-[11px] text-text-tertiary leading-loose font-mono uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">
        "{testimonial.quote.toUpperCase()}"
      </p>
      <div className="flex items-center justify-between pt-8 border-t-2 border-white/5">
        <div>
          <p className="text-sm font-display font-bold text-white uppercase tracking-tighter italic">
            {testimonial.name}
          </p>
          <p className="text-[10px] text-red font-mono uppercase tracking-[0.3em] font-extrabold mt-1">
             // ORIGIN: {testimonial.city.toUpperCase()}
          </p>
        </div>
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-white px-4 py-1.5 bg-red border-2 border-red-light/20 shadow-hard-red font-display italic">
           {testimonial.caseType.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function NewsTicker() {
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % LEGAL_NEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-void border-2 border-red/40 rounded-sm px-6 py-4 shadow-hard-red/5">
      {/* Scanning Bar */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-red/20 overflow-hidden">
        <motion.div 
           animate={{ x: ['-100%', '100%'] }} 
           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
           className="w-1/4 h-full bg-red" 
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Newspaper className="w-5 h-5 text-red" />
          <span className="text-[10px] uppercase font-extrabold tracking-[0.5em] text-red italic">
            TACTICAL_ALERTS
          </span>
        </div>
        <div className="h-5 w-[2px] bg-void/10 flex-shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNews}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-5 min-w-0"
          >
            <span className="text-[9px] uppercase font-extrabold tracking-[0.3em] text-white px-3 py-1 bg-void border-2 border-white/10 rounded-sm flex-shrink-0 italic">
              {LEGAL_NEWS[currentNews].tag.toUpperCase()}
            </span>
            <p className="text-[12px] text-white/90 font-mono truncate uppercase tracking-widest italic leading-none">
              {LEGAL_NEWS[currentNews].title}
            </p>
            <span className="text-[10px] text-red font-extrabold flex-shrink-0 font-mono tracking-tighter">
              [{LEGAL_NEWS[currentNews].date.toUpperCase()}]
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'AI_LEGAL_CHAT',
      description:
        'DESCRIBE YOUR CASE TO THE INTELLIGENT CO-PILOT. RECEIVE STRATEGIC ARGUMENTS AND COURTROOM DEPLOYMENT LOGS.',
      link: '/chat',
      cta: 'INITIALIZE_ANALYSIS',
    },
    {
      icon: FileText,
      title: 'DOC_GEN_TERMINAL',
      description:
        'GENERATE LEGAL NOTICES, CONSUMER COMPLAINTS, AND RTI APPLICATIONS VIA AUTOMATED MANDATE ENGINE.',
      link: '/documents',
      cta: 'EXECUTE_DOCUMENT',
    },
    {
      icon: BookOpen,
      title: 'RIGHTS_REGISTRY',
      description:
        'EXPLORE MANDATED RIGHTS ACROSS CONSUMER, TENANT, AND PRIVATE CIVILIAN DATA CATEGORIES.',
      link: '/rights',
      cta: 'VERIFY_RIGHTS',
    },
    {
      icon: Calculator,
      title: 'FISCAL_ESTIMATOR',
      description:
        'CALCULATE COURT REVENUE, ADVOCATE MANDATES, AND TEMPORAL RESOLUTION WINDOWS PRIOR TO FILING.',
      link: '/estimator',
      cta: 'PROJECT_COSTS',
    },
    {
      icon: UserCheck,
      title: 'LOCATE_ADVOCATE',
      description:
        'BROWSE VALIDATED ADVOCATE_NODES BY JURISDICTION, SPECIALIZATION, AND OPERATIONAL SENIORITY.',
      link: '/lawyers',
      cta: 'SEARCH_REGISTRY',
    },
    {
      icon: Milestone,
      title: 'CASE_TRACKER',
      description:
        'TRACK THE JURIDICAL JOURNEY THROUGH MANDATED PHASES. STAY SYNCHRONIZED WITH SYSTEM MILESTONES.',
      link: '/tracker',
      cta: 'AUDIT_CASE_LOG',
    },
    {
      icon: Brain,
      title: 'LITIGATION_QUIZ',
      description:
        'VERIFY TACTICAL KNOWLEDGE OF INDIAN STATUTORY PROTOCOLS THROUGH ANALYTICAL ASSESSMENT.',
      link: '/quiz',
      cta: 'START_ASSESSMENT',
    },
    {
      icon: Milestone,
      title: 'SAMPLE_VECTORS',
      description:
        'ACCESS PRE-LOADED DEPLOYMENT SCENARIOS TO ANALYZE JUSTICEAI CORE_SYSTEM BEHAVIOR.',
      link: '/samples',
      cta: 'LOAD_SAMPLES',
    },
  ];

  const pillarCards = [
    {
      id: '1',
      title: 'BNS_INTELLIGENCE',
      description:
        'ANALYTICAL DEPLOYMENT OF BHARATIYA NYAYA SANHITA (2023). BRIDGING THE GAP FROM LEGACY IPC TO DIGITAL_FIRST STATUTES.',
      icon: <Milestone className="w-5 h-5" />,
    },
    {
      id: '2',
      title: 'CIVIL_SHIELD',
      description:
        'CONSTITUTIONAL DEFENSE VECTORS. INSTANT GUIDANCE ON FUNDAMENTAL RIGHTS AND STATUTORY PROTECTIONS.',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      id: '3',
      title: 'SUPREME_ADVOCACY',
      description:
        'PROFESSIONAL_GRADE ANALYTICS. AI_LOGIC SYNCHRONIZED WITH THE ANALYTICAL RIGOR OF SENIOR COUNSEL_MANDATES.',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: '4',
      title: 'DIGITAL_AUTHORITY',
      description:
        'BUILT FOR THE FUTURE OF THE INDIAN BUREAUCRACY. INTEGRATED WITH E-COURTS AND NALSA PROTOCOL_STREAMS.',
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-void font-mono">
      {/* Motion Graphics Canvas */}
      <MotionGraphics />
      
      {/* Background Effects */}
      <div className="aurora-effect">
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
      </div>
      <div className="grain-overlay pointer-events-none" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* News Ticker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <NewsTicker />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center md:text-left grid lg:grid-cols-2 gap-20 items-center"
        >
          {/* Left Column: Hero Content */}
          <div className="space-y-12">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="inline-flex items-center gap-4 px-5 py-2 bg-void text-red text-[11px] uppercase font-extrabold tracking-[0.5em] rounded-sm border-2 border-red/40 mb-6 shadow-hard-red/10 italic">
                <Sparkles className="w-4 h-4" />
                <span>UPGRADE: CORE_OS_V2.1_ACTIVE</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.9] text-white py-2 uppercase tracking-tighter italic">
                SECURE <br />
                <span className="text-red">SOVEREIGNTY</span>
              </h1>
              <p className="text-lg md:text-xl text-text-tertiary font-mono max-w-xl leading-relaxed border-l-4 border-red/40 pl-8 ml-1 uppercase tracking-widest italic opacity-60">
                EMPOWERING CITIZENS WITH AI_CORE ANALYTICS. DECODE STATUTES, BUILD DEFENSE_VECTORS, AND NAVIGATE THE BUREAUCRACY WITH ABSOLUTE PRECISION.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 justify-center md:justify-start pt-6"
            >
              <button
                onClick={() => navigate('/chat')}
                className="group relative bg-red text-white px-12 py-6 rounded-sm font-extrabold text-xl uppercase tracking-[0.4em] italic flex items-center gap-6 hover:bg-red-dark transition-all active:translate-x-[2px] active:translate-y-[2px] shadow-hard-red"
              >
                <span>INITIALIZE_CORE</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="flex items-center gap-5 px-10 py-6 rounded-sm border-2 border-white/10 bg-void shadow-hard">
                <ShieldCheck className="w-6 h-6 text-blue" />
                <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-[0.4em] italic opacity-60">
                   BNS_V2_VALIDATED
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-10 pt-16 border-t-2 border-white/5"
            >
              <div className="space-y-2 text-center md:text-left">
                <span className="text-4xl font-display font-bold text-red uppercase tracking-tighter italic leading-none">
                  40+
                </span>
                <p className="text-[9px] uppercase tracking-[0.4em] text-text-tertiary font-extrabold italic opacity-40">
                  STATUTORY_ACTS
                </p>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-4xl font-display font-bold text-blue italic tracking-tighter leading-none">
                  24/7
                </span>
                <p className="text-[9px] uppercase tracking-[0.4em] text-text-tertiary font-extrabold italic opacity-40">
                   NODE_UPTIME
                </p>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-4xl font-display font-bold text-white uppercase tracking-tighter italic leading-none">
                  ENCRYPTED
                </span>
                <p className="text-[9px] uppercase tracking-[0.4em] text-text-tertiary font-extrabold italic opacity-40">
                  DATA_HYGIENE
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Elements */}
          <motion.div variants={itemVariants} className="hidden lg:block relative">
            <div className="absolute inset-0 bg-red/10 blur-[150px] rounded-full opacity-20" />
            <div className="relative bg-void border-2 border-red/20 rounded-sm p-12 shadow-hard space-y-10 group overflow-hidden">
               {/* Internal Scanning Light */}
              <div className="absolute top-0 right-0 w-full h-[2px] bg-red/20 group-hover:bg-red/40 transition-colors animate-scan" />
              
              <div className="flex items-center gap-6 border-b-2 border-white/5 pb-10">
                <div className="w-16 h-16 rounded-sm bg-void border-2 border-red/20 flex items-center justify-center shadow-inner group-hover:border-red transition-all">
                  <FileText className="w-8 h-8 text-red" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter italic leading-none">
                    MANIFEST <span className="text-red">#77-A</span>
                  </h3>
                  <p className="text-[10px] text-text-tertiary font-extrabold uppercase tracking-[0.3em] mt-2 opacity-60 italic">
                    REF: BNS_SECTION_INDEX_V2.1_ALPHA
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] uppercase font-extrabold tracking-[0.5em] italic">
                    <span className="text-text-tertiary opacity-40">ANALYTICS_PRECISION</span>
                    <span className="text-blue">94.2%</span>
                  </div>
                  <div className="h-4 bg-void border-2 border-white/10 rounded-sm overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '94.2%' }}
                      transition={{ delay: 1, duration: 2, ease: "circOut" }}
                      className="h-full bg-red shadow-hard-red/40"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="p-8 rounded-sm bg-void border-2 border-white/5 text-[11px] text-text-tertiary leading-loose font-mono uppercase tracking-[0.2em] italic shadow-inner border-l-4 border-l-red relative">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-void/[0.02] border-l border-b border-white/5" />
                    <span className="text-white font-extrabold block mb-3 uppercase tracking-[0.4em] italic">
                       // SYSTEM_OBSERVATION:
                    </span>
                    BASED ON <strong className="text-red underline decoration-dotted">SECTION_35_MANDATE</strong>, SUBJECT ENTITLED TO FILING FOR RECOVERY_INDEMNIFICATION. DEPLOYMENT PROBABILITY: <span className="text-blue font-bold">OPTIMIZED</span>.
                  </div>
                  <div className="flex gap-4">
                    <span className="px-6 py-2.5 rounded-sm bg-red text-[10px] text-white font-extrabold uppercase tracking-[0.3em] italic shadow-hard-red/20 active:translate-y-[2px]">
                       NODE_STABLE
                    </span>
                    <span className="px-6 py-2.5 rounded-sm bg-void text-[10px] text-text-tertiary border-2 border-red/40 uppercase font-extrabold tracking-[0.3em] italic shadow-hard-red/5">
                       PROCEDURAL_OVERRIDE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-48 space-y-24"
        >
          <motion.div variants={itemVariants} className="text-center space-y-10">
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter text-white leading-none italic">
              BUREAU <span className="text-red">MODULES</span>
            </h2>
            <p className="text-lg text-text-tertiary font-mono max-w-2xl mx-auto uppercase tracking-[0.4em] italic opacity-60 leading-relaxed">
              THE COMPLETE LEGAL ARSENAL FOR THE SOVEREIGN CITIZEN. HIGH-PERFORMANCE ANALYSIS, TACTICAL DOCUMENTATION, AND OPERATIONAL OVERSIGHT.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  onClick={() => navigate(feature.link)}
                  className="group cursor-pointer p-10 rounded-sm bg-void border-2 border-white/5 hover:border-red/40 transition-all duration-500 space-y-8 shadow-hard hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-hard relative overflow-hidden"
                >
                  {/* Tactical Corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red/0 group-hover:border-red/40 transition-all" />
                  
                  <div className="w-16 h-16 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center group-hover:border-red group-hover:bg-red/10 transition-all duration-500 shadow-inner">
                    <Icon className="w-8 h-8 text-red" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter group-hover:text-red transition-colors italic leading-none">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] text-text-tertiary font-body leading-loose uppercase tracking-widest italic opacity-50 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-extrabold text-red uppercase tracking-[0.5em] group-hover:gap-6 transition-all italic">
                    <span>{feature.cta}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pillard & Morphing Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-48 space-y-24 border-y-2 border-white/5 py-40 relative"
        >
          <div className="absolute inset-0 bg-red/5 blur-[150px] opacity-10" />
          <motion.div variants={itemVariants} className="text-center space-y-10 relative z-10">
            <h2 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter text-white leading-none italic">
               SYTEM <span className="text-red">INTEGRITY</span>
            </h2>
          </motion.div>

          <div className="py-12 relative z-10">
            <MorphingCardStack
              cards={pillarCards}
              defaultLayout="stack"
              className="max-w-4xl mx-auto"
            />
          </div>
        </motion.div>

        {/* Testimonials Segment */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-48 space-y-24"
        >
          <div className="text-center space-y-10">
             <div className="inline-flex items-center gap-4 px-5 py-2 bg-void text-red text-[11px] uppercase font-extrabold tracking-[0.5em] rounded-sm border-2 border-red/40 shadow-hard-red/10 italic">
                <Star className="w-5 h-5 mx-auto" />
                <span>OPERATIONAL_FEEDBACK_LOG</span>
              </div>
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter text-white leading-none italic">
               CITIZEN <span className="text-red">IMPACT</span>
            </h2>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-12 -mx-6 px-6 flex gap-10 snap-x snap-mandatory scroll-smooth no-scrollbar">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="snap-center">
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-void to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-void to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Tactical Pipeline (How it works) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-48 space-y-24 pt-40 border-t-2 border-white/5"
        >
          <motion.div variants={itemVariants} className="text-center space-y-10">
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter text-white leading-none italic">
              EXECUTION <span className="text-red">PIPELINE</span>
            </h2>
             <p className="text-lg text-text-tertiary font-mono max-w-2xl mx-auto uppercase tracking-[0.4em] italic opacity-60 leading-relaxed">
               REPLICABLE WORKFLOW FOR SECURING STATUTORY JUSTICE_STREAMS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[4rem] left-[20%] right-[20%] h-1 bg-gradient-to-r from-red/5 via-red/40 to-red/5 opacity-40" />

            {[
              {
                step: '01',
                icon: Send,
                title: 'INPUT_VECTOR',
                desc: 'UPLOAD CASE PARAMETERS IN PLAIN DIALECT. RAG_ENGINE ANALYZES EVERY DISCRETE SECTOR.',
                color: 'text-red',
                bg: 'bg-void border-red/40 shadow-hard-red/10',
              },
              {
                step: '02',
                icon: Brain,
                title: 'TACTICAL_REFINE',
                desc: 'JUSTICEAI MAPS HISTORICAL PRECEDENTS AND CURRENT BNS STATUTES TO BUILD YOUR DEFENSE_VECTORS.',
                color: 'text-red',
                bg: 'bg-void border-red/40 shadow-hard-red/10',
              },
              {
                step: '03',
                icon: Award,
                title: 'RESOLUTION',
                desc: 'EXECUTE DOCUMENTATION AND MANDATED FILING. AUTOMATED OVERSIGHT FOR THE JURIDICAL SECURE.',
                color: 'text-red',
                bg: 'bg-void border-red/40 shadow-hard-red/10',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative p-12 rounded-sm bg-void border-2 border-white/5 text-center space-y-8 group hover:border-red/40 transition-all duration-500 shadow-hard"
              >
                <div
                  className={`w-24 h-24 rounded-sm ${item.bg} border-2 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:border-red transition-all`}
                >
                  <item.icon className={`w-12 h-12 ${item.color}`} />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-red font-extrabold block italic">
                    SEQUENCE_{item.step}
                  </span>
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter italic leading-none">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-text-tertiary font-body leading-loose uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Global CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-64 pb-32"
        >
          <div className="relative overflow-hidden rounded-sm p-24 md:p-32 text-center space-y-16 bg-void border-2 border-red/20 shadow-hard group">
             {/* Diagonal Stripes */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ff0000_10px,#ff0000_11px)]" />
             
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red/10 blur-[150px] rounded-full" />

            <Scale className="w-24 h-24 text-red mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(225,29,72,0.8)] animate-pulse" />

            <div className="space-y-10 relative z-10">
              <h2 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter text-white leading-none italic">
                SECURE <br />
                <span className="text-red">JUSTICE_NOW</span>
              </h2>
              <p className="text-lg md:text-xl text-text-tertiary font-mono max-w-2xl mx-auto leading-relaxed border-y-2 border-white/5 py-12 uppercase tracking-[0.3em] italic opacity-60">
                INITIALIZE YOUR CASE SEQUENCE TODAY. JUSTICE IS NO LONGER A LUXURY — IT IS AN OPERATIONAL REQUIREMENT.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-10 relative z-10">
              <button
                onClick={() => navigate('/chat')}
                className="group bg-red text-white px-16 py-8 rounded-sm font-extrabold text-2xl uppercase tracking-[0.4em] italic flex items-center gap-6 hover:bg-red-dark transition-all active:translate-x-[2px] active:translate-y-[2px] shadow-hard-red"
              >
                <span>DEPLOY_CORE</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/rights')}
                className="group bg-void border-2 border-white/10 hover:border-red text-text-tertiary hover:text-white px-16 py-8 rounded-sm font-extrabold text-2xl uppercase tracking-[0.4em] italic flex items-center gap-6 transition-all shadow-hard active:translate-y-[2px]"
              >
                <ShieldCheck className="w-8 h-8 text-red" />
                <span>VERIFY_RIGHTS</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
