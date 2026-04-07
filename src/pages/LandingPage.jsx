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
  LayoutDashboard,
  Zap,
  Send,
  Award,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { MorphingCardStack } from '../components/ui/morphing-card-stack';
import MotionGraphics from '../components/ui/MotionGraphics';

// Legal News Data
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
      'JusticeAI is an excellent first-referral tool. I used it to quickly draft a consumer notice for a client, saving hours of clerical work.',
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
      'The Limitation Calculator alerted me that I only had a few days left to file my claim. It ensured my case wasn\'t time-barred.',
    caseType: 'MACT',
    rating: 5,
  },
  {
    id: 4,
    name: 'Dr. Aruna V.',
    city: 'Chennai',
    quote:
      'The document generation system is highly efficient. It formats applications precisely as per the legal requirements of the 2005 Act.',
    caseType: 'RTI',
    rating: 4,
  },
  {
    id: 5,
    name: 'Karan Singh',
    city: 'Chandigarh',
    quote:
      'The Legal Aid checker helped me find free representation for my staff. The process was professional and the outcome successful.',
    caseType: 'Legal Aid',
    rating: 5,
  },
];

function TestimonialCard({ testimonial }) {
  return (
    <div className="flex-shrink-0 w-[340px] md:w-[400px] p-10 rounded-sm bg-void border-2 border-white/5 hover:border-gold/30 transition-all duration-500 space-y-8 shadow-hard relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-1.5 h-full bg-gold/5 group-hover:bg-gold transition-all" />
      <div className="flex items-center gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gold fill-gold" />
        ))}
      </div>
      <Quote className="w-10 h-10 text-white/5 group-hover:text-gold/10 transition-all" />
      <p className="text-sm text-text-tertiary leading-relaxed font-body italic opacity-80 group-hover:opacity-100 transition-opacity">
        "{testimonial.quote}"
      </p>
      <div className="flex items-center justify-between pt-8 border-t border-white/5">
        <div>
          <p className="text-base font-display font-bold text-white tracking-tight">
            {testimonial.name}
          </p>
          <p className="text-[10px] text-gold font-body uppercase tracking-widest font-bold mt-1 opacity-60">
             {testimonial.city}
          </p>
        </div>
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-midnight px-4 py-1.5 bg-gold border-2 border-gold/20 rounded-sm shadow-hard font-display italic">
           {testimonial.caseType}
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
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-void border-2 border-gold/20 rounded-sm px-8 py-3 shadow-luxe">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Newspaper className="w-4 h-4 text-gold" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
            LIFECYCLE_TICKER_V1
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/10 flex-shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNews}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-4 min-w-0"
          >
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-white/40 px-3 py-1 bg-white/5 rounded-sm flex-shrink-0 italic">
              {LEGAL_NEWS[currentNews].tag}
            </span>
            <p className="text-xs text-white/90 font-body truncate tracking-wide">
              {LEGAL_NEWS[currentNews].title}
            </p>
            <span className="text-[9px] text-gold font-bold flex-shrink-0 font-mono opacity-60">
              {LEGAL_NEWS[currentNews].date}
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'AI_STATUTORY_CO_PILOT',
      description:
        'Engage with our intelligent legal co-pilot for case analysis and strategic guidance based on current statutes.',
      link: '/chat',
      cta: 'Start Analysis',
    },
    {
      icon: FileText,
      title: 'Document Factory',
      description:
        'Generate professional legal notices, consumer complaints, and RTI applications with our automated drafting engine.',
      link: '/documents',
      cta: 'Draft Document',
    },
    {
      icon: BookOpen,
      title: 'Digital Rights Registry',
      description:
        'Detailed exploration of your fundamental rights across consumer, tenant, and civil law categories.',
      link: '/rights',
      cta: 'Explore Rights',
    },
    {
      icon: Calculator,
      title: 'Legal Fee Estimator',
      description:
        'Accurately calculate court fees, advocate averages, and resolution timelines tailored to your specific matter.',
      link: '/estimator',
      cta: 'Estimate Costs',
    },
    {
      icon: UserCheck,
      title: 'Lawyer Directory',
      description:
        'Access a vetted registry of advocates segmented by jurisdiction, specialization, and verified experience.',
      link: '/lawyers',
      cta: 'Find Counsel',
    },
    {
      icon: Milestone,
      title: 'Case Life-Cycle Tracker',
      description:
        'Visualized Case Journey through institutional phases. Stay synchronized with your legal milestones.',
      link: '/tracker',
      cta: 'Track Case',
    },
    {
      icon: Brain,
      title: 'Knowledge Academy',
      description:
        'Refine your understanding of Indian statutory protocols through interactive analytical assessments.',
      link: '/quiz',
      cta: 'Begin Learning',
    },
    {
      icon: LayoutDashboard,
      title: 'Legal Glossary',
      description:
        'Comprehensive database of BNS and legacy IPC terms for clear understanding of legal terminology.',
      link: '/glossary',
      cta: 'Browse Glossary',
    },
  ];

  const pillarCards = [
    {
      id: '1',
      title: 'BNS Intelligence',
      description:
        'Analytical alignment with Bharatiya Nyaya Sanhita (2023). Bridging the transition from legacy IPC to modern digital statutes.',
      icon: <Milestone className="w-5 h-5" />,
    },
    {
      id: '2',
      title: 'Civil Defense',
      description:
        'Institutional protection mechanisms. Immediate guidance on fundamental rights and statutory civil protections.',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      id: '3',
      title: 'Professional Advocacy',
      description:
        'Enterprise-grade legal analytics. AI logic synchronized with the analytical rigor expected from senior counsel.',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: '4',
      title: 'Institutional Access',
      description:
        'Designed for the future of Indian legal systems. Fully aligned with e-Courts and NALSA protocol initiatives.',
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-void font-mono">
      {/* Motion Graphics Canvas */}
      <MotionGraphics />
      
      {/* Background Effects */}
      <div className="aurora-effect">
        <div className="aurora-blob bg-gold/5 opacity-20"></div>
        <div className="aurora-blob bg-blue-500/5 opacity-20"></div>
        <div className="aurora-blob bg-gold/5 opacity-10"></div>
      </div>
      <div className="grain-overlay pointer-events-none opacity-[0.03]" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* News Ticker */}
        <div className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <NewsTicker />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left grid lg:grid-cols-2 gap-20 items-center"
        >
          {/* Left Column: Hero Content */}
          <div className="space-y-12">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[10px] uppercase font-extrabold tracking-[0.5em] italic rounded-sm shadow-luxe font-display">
                <Sparkles className="w-4 h-4" />
                <span>STATUTORY_ANALYTICS_V4.0</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.9] text-white py-2 uppercase tracking-tighter italic">
                AUTHORIZE <br />
                <span className="text-gold">JUSTICE.</span>
              </h1>
              <p className="text-xs md:text-sm text-text-tertiary font-mono max-w-xl leading-relaxed border-l-2 border-gold/40 pl-8 mx-auto lg:mx-0 opacity-60 uppercase tracking-[0.2em] italic">
                EMPOWERING CITIZENS WITH ADVANCED STATUTORY ANALYTICS. DECODE COMPLEX PROTOCOLS AND NAVIGATE THE INDIAN INSTITUTIONAL SYSTEM WITH ABSOLUTE CLARITY.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 justify-center lg:justify-start pt-6"
            >
              <button
                onClick={() => navigate('/chat')}
                className="group relative bg-gold text-midnight px-12 py-6 rounded-sm border-2 border-gold-light/20 font-extrabold text-lg uppercase tracking-widest flex items-center gap-6 hover:bg-gold-light transition-all shadow-hard active:translate-y-[2px] italic"
              >
                <span>INITIALIZE_CONSULTATION</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="flex items-center gap-4 px-8 py-5 rounded-sm border-2 border-white/5 bg-void shadow-hard">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-[0.4em] opacity-40 italic">
                   BNS_2023_COMPLIANT
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-10 pt-16 border-t border-white/5"
            >
              <div className="space-y-2 text-center lg:text-left">
                <span className="text-4xl font-display font-bold text-gold tracking-tight leading-none">
                  45+
                </span>
                <p className="text-[9px] uppercase tracking-widest text-text-tertiary font-bold opacity-40">
                  Statutory Hubs
                </p>
              </div>
              <div className="space-y-2 text-center lg:text-left">
                <span className="text-4xl font-display font-bold text-gold tracking-tight leading-none">
                  24/7
                </span>
                <p className="text-[9px] uppercase tracking-widest text-text-tertiary font-bold opacity-40">
                   System Uptime
                </p>
              </div>
              <div className="space-y-2 text-center lg:text-left">
                <span className="text-4xl font-display font-bold text-white tracking-tight leading-none uppercase">
                  Secure
                </span>
                <p className="text-[9px] uppercase tracking-widest text-text-tertiary font-bold opacity-40">
                  End-to-End Privacy
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Component Overlay */}
          <motion.div variants={itemVariants} className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gold/10 blur-[150px] rounded-sm opacity-20" />
            <div className="relative bg-void border-2 border-white/5 rounded-sm p-12 shadow-hard space-y-10 group overflow-hidden">
               {/* Internal Animation Accent */}
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gold/20 group-hover:bg-gold/40 transition-colors" />
              
              <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                <div className="w-16 h-16 rounded-sm bg-void border-2 border-gold/20 flex items-center justify-center shadow-hard group-hover:border-gold transition-all">
                  <FileText className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                    Case Analysis <span className="text-gold">#V46</span>
                  </h3>
                  <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-2 opacity-60">
                    Proprietary RAG Intelligence Model
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest">
                    <span className="text-text-tertiary opacity-40">Reasoning Accuracy</span>
                    <span className="text-gold">98.4%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-sm overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '98.4%' }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gold shadow-luxe"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="p-8 rounded-sm bg-void border-2 border-white/5 text-[12px] text-text-tertiary leading-relaxed font-body shadow-hard border-l-4 border-l-gold relative italic">
                    <span className="text-white font-bold block mb-2 uppercase tracking-widest text-[10px]">
                       // Strategic Assessment:
                    </span>
                    Identification of key protections under <strong className="text-gold">BNS Section 35</strong> completes. Recommendation: Proceed with formal consumer notice drafting.
                  </div>
                  <div className="flex gap-4">
                    <span className="px-6 py-2 rounded-sm border-2 border-gold/30 text-[9px] text-gold font-extrabold uppercase tracking-widest italic shadow-hard">
                       Deep Insights
                    </span>
                    <span className="px-6 py-2 rounded-sm border-2 border-white/10 text-[9px] text-text-tertiary uppercase font-extrabold tracking-widest italic shadow-hard">
                       Verify Case
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Capabilities Hub Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-48 space-y-24"
        >
          <motion.div variants={itemVariants} className="text-center space-y-8">
            <h2 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter text-white leading-none italic pb-4">
              STATUTORY <span className="text-gold">SUITE</span>
            </h2>
            <p className="text-xs text-text-tertiary font-mono max-w-2xl mx-auto uppercase tracking-[0.3em] opacity-40 italic">
              A COMPREHENSIVE SUITE FOR SECURING PROCEDURAL OUTCOMES THROUGH ADVANCED ANALYTICAL LOGIC.
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
                  className="group cursor-pointer p-10 rounded-sm bg-void border-2 border-white/5 hover:border-gold/30 transition-all duration-500 space-y-8 shadow-hard relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500 shadow-hard">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-widest group-hover:text-gold transition-colors leading-none italic">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-tertiary font-body leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-extrabold text-gold uppercase tracking-[0.4em] group-hover:gap-6 transition-all italic">
                    <span>{feature.cta}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Structural Integrity Morphing Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-48 space-y-24 border-y border-white/5 py-40 relative"
        >
          <div className="absolute inset-0 bg-gold/5 blur-[150px] opacity-10" />
          <motion.div variants={itemVariants} className="text-center space-y-10 relative z-10">
            <h2 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tight text-white leading-none italic pb-4">
               CORE <span className="text-gold">VALUES</span>
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

        {/* Global Impact / Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-48 space-y-24"
        >
          <div className="text-center space-y-10">
            <div className="inline-flex items-center gap-4 px-5 py-2 bg-void text-gold text-[10px] uppercase font-extrabold tracking-widest rounded-sm border-2 border-gold/20 shadow-hard italic">
                <Star className="w-4 h-4" />
                <span>Verified User Impact</span>
              </div>
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tight text-white leading-none italic">
               STATUTORY <span className="text-gold">TESTIMONIES</span>
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
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-midnight to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-midnight to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Methodology Pathway */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-48 space-y-24 pt-40 border-t border-white/5"
        >
          <motion.div variants={itemVariants} className="text-center space-y-10">
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tight text-white leading-none">
              Strategic <span className="text-gold">Pathway</span>
            </h2>
             <p className="text-lg text-text-tertiary font-body max-w-2xl mx-auto opacity-60 leading-relaxed">
               A refined methodology for securing institutional legal outcomes through AI intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[4rem] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {[
              {
                step: '01',
                icon: Send,
                title: 'Data Intake',
                desc: 'Describe your case parameters in conversational language. Our engine interprets every detail.',
                color: 'text-gold',
                bg: 'bg-midnight border-gold/20',
              },
              {
                step: '02',
                icon: Brain,
                title: 'Contextual Refinement',
                desc: 'JusticeAI cross-references historical precedents and modern BNS statutes to build your case profile.',
                color: 'text-gold',
                bg: 'bg-midnight border-gold/20',
              },
              {
                step: '03',
                icon: Award,
                title: 'Professional Outcome',
                desc: 'Download drafted documentation or connect with verified experts to execute your legal strategy.',
                color: 'text-gold',
                bg: 'bg-midnight border-gold/20',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative p-12 rounded-sm bg-void border-2 border-white/5 text-center space-y-8 group hover:border-gold/30 transition-all duration-500 shadow-hard"
              >
                <div
                  className={`w-24 h-24 rounded-sm ${item.bg} border-2 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-500 shadow-hard group-hover:border-gold`}
                >
                  <item.icon className={`w-12 h-12 ${item.color}`} />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold block opacity-60">
                    Phase {item.step}
                  </span>
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tight leading-none">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-tertiary font-body leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
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
          <div className="relative overflow-hidden rounded-sm p-24 md:p-32 text-center space-y-16 bg-void border-2 border-gold/20 shadow-hard group">
             {/* Subtle Texture Overlay */}
             <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#d4af37_10px,#d4af37_11px)]" />
             
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 blur-[150px] rounded-full" />

            <Scale className="w-24 h-24 text-gold mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-pulse" />

            <div className="space-y-10 relative z-10">
              <h2 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tight text-white leading-none">
                Experience <br />
                <span className="text-gold">Legal Clarity.</span>
              </h2>
              <p className="text-lg md:text-xl text-text-tertiary font-body max-w-2xl mx-auto leading-relaxed border-y border-white/5 py-12 uppercase tracking-widest opacity-80">
                Begin your consultation today. Justice is no longer an obstacle — it is an accessible fundamental right.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 relative z-10">
              <button
                onClick={() => navigate('/chat')}
                className="group bg-gold text-midnight px-16 py-8 rounded-sm font-extrabold text-2xl uppercase tracking-widest flex items-center gap-6 hover:bg-gold-light transition-all shadow-hard active:translate-y-[2px] italic"
              >
                <span>INITIALIZE_CONSULTATION</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/rights')}
                className="group bg-void border-2 border-white/10 hover:border-gold text-text-tertiary hover:text-white px-16 py-8 rounded-sm font-extrabold text-2xl uppercase tracking-widest flex items-center gap-6 transition-all shadow-hard active:translate-y-[2px] italic"
              >
                <ShieldCheck className="w-8 h-8 text-gold" />
                <span>Verify Rights</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
