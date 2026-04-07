import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Home, Briefcase, LandPlot, Play, ArrowRight, Terminal, ShieldAlert } from 'lucide-react';
import Header from '../components/ui/Header';

const SAMPLES = [
  {
    id: 'consumer',
    title: 'CONSUMER_RIGHTS_VINC',
    description: 'DEFECTIVE_HARDWARE_RECLAMATION [85K_INR]. REFUSED_REFUND_PROTOCOL.',
    icon: ShoppingBag,
    color: 'text-red',
    initialMessage:
      "I bought a premium laptop for ₹85,000 last month. It stopped working after 10 days. The retailer refuses a refund and says it's physical damage. The service center says it's a motherboard failure. What are my rights under the Consumer Protection Act?",
  },
  {
    id: 'tenant',
    title: 'TENANT_DISPUTE_LINK',
    description: 'SECURITY_DEPOSIT_RETAINMENT_ANOMALY. BANGALORE_HUB_PROTOCOL.',
    icon: Home,
    color: 'text-blue',
    initialMessage:
      "I moved out of my flat in Bangalore last week after completing the full notice period. My landlord is refusing to return my security deposit of ₹1,00,000, claiming 'painting charges' and 'minor wear and tear' without any itemized bill. What legal steps can I take?",
  },
  {
    id: 'workplace',
    title: 'WORKPLACE_BREACH_LOG',
    description: 'TERMINATION_WITHOUT_NOTICE_CYCLE. SEVERANCE_PAY_DENIAL.',
    icon: Briefcase,
    color: 'text-red-light',
    initialMessage:
      'I was suddenly terminated from my job yesterday with no prior warning or performance issues. My contract requires a 3-month notice period, but they told me to leave immediately and are refusing to pay for the notice period. This is a clear breach of my employment contract.',
  },
  {
    id: 'property',
    title: 'PROPERTY_CATEGORY_SYNC',
    description: 'ENCROACHMENT_TRAJECTORY_ALERT. ANCESTRAL_LAND_DISPUTE.',
    icon: LandPlot,
    color: 'text-gold',
    initialMessage:
      'I have ancestral agricultural land in Pune. My neighbor has started a construction project that encroaches about 5 feet into my clearly marked boundary. I have the official land survey records from 1995, but he is ignoring my requests to stop. How do I file an injunction?',
  },
];

export default function SamplesPage() {
  const navigate = useNavigate();

  const handleLaunch = (sample) => {
    navigate('/chat', { state: { sampleCase: sample.initialMessage, caseType: sample.title } });
  };

  return (
    <div className="min-h-screen bg-void pb-32 font-mono">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 space-y-16">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[10px] uppercase font-extrabold tracking-[0.4em] italic rounded-sm shadow-hard">
            <Terminal className="w-4 h-4" />
            <span>CASE_ANALYSIS_MODELS</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white uppercase tracking-tighter italic leading-none">
            STATUTORY <span className="text-gold">CASE_BRIEFS</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.2em] italic opacity-60">
            PREVIEW LEGAL ANALYSIS MODELS FOR COMMON SCENARIOS. SELECT A CASE BRIEF TO INITIALIZE.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SAMPLES.map((sample, i) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-full"
            >
              <div className="h-full p-10 rounded-sm bg-void border-2 border-white/5 hover:border-gold/40 transition-all duration-500 overflow-hidden flex flex-col shadow-hard hover:shadow-hard-gold/20 active:translate-y-[2px]">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-sm bg-gold/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-16 h-16 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center mb-10 group-hover:border-gold/40 group-hover:scale-110 transition-all shadow-hard relative">
                   {/* ANALYZE BAR ANIMATION */}
                   <div className="absolute inset-0 bg-gold/10 w-full h-1 group-hover:animate-analyze z-0" />
                  <sample.icon className={`w-8 h-8 ${sample.color === 'text-red' ? 'text-gold' : sample.color === 'text-red-light' ? 'text-gold-light' : sample.color} relative z-10`} />
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-gold transition-colors uppercase tracking-tight italic leading-tight">
                  {sample.title}
                </h3>
                <p className="text-[10px] text-text-tertiary leading-relaxed uppercase tracking-widest italic opacity-60 mb-10 flex-1">
                  {sample.description}
                </p>

                <button
                  onClick={() => handleLaunch(sample)}
                  className="w-full flex items-center justify-between gap-4 bg-void border-2 border-white/10 group-hover:border-gold group-hover:bg-gold group-hover:text-midnight text-text-tertiary px-6 py-5 rounded-sm font-extrabold text-[10px] uppercase tracking-[0.3em] italic transition-all group-hover:shadow-hard active:translate-y-[2px]"
                >
                  <span>START_BRIEF</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-16 rounded-sm bg-void border-2 border-white/5 text-center space-y-10 shadow-hard relative overflow-hidden group hover:border-gold/20 transition-all">
           {/* Background Decor */}
           <div className="absolute bottom-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert className="w-48 h-48 text-white" />
           </div>
           
           <div className="relative z-10 space-y-4">
              <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter">UNIQUE_CATEGORY_REQUIRED?</h2>
              <p className="text-xs text-text-tertiary uppercase tracking-[0.2em] max-w-xl mx-auto italic opacity-60">
                CUSTOM_MODEL_ENABLED. INITIALIZE A CUSTOM ANALYTICAL FLOW FOR NON-STANDARD LEGAL SCENARIOS.
              </p>
           </div>
           
           <div className="relative z-10 pt-4">
              <motion.a
                href="/chat"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-4 bg-gold border-2 border-gold-light/40 text-midnight px-14 py-6 rounded-sm font-extrabold text-[11px] uppercase tracking-[0.4em] transition-all shadow-hard-gold italic hover:bg-black hover:text-gold hover:shadow-hard active:shadow-none active:translate-y-[2px]"
              >
                <span>START_ANALYSIS</span>
                <Play className="w-4 h-4 fill-current" />
              </motion.a>
           </div>
        </div>
      </main>
    </div>
  );
}
