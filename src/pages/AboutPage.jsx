import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Shield, Users, Target } from 'lucide-react';
import Header from '../components/ui/Header';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      icon: Target,
      title: 'STRATEGIC_MANDATE',
      description:
        "TO DEMOCRATIZE LEGAL SOVEREIGNTY. JUSTICE_STREAMS ARE THE REMEDY OF THE CITIZEN, NOT THE PRIVILEGE OF THE ELITE.",
    },
    {
      icon: Users,
      title: 'CITIZEN_SOVEREIGNTY',
      description:
        'DESIGNED SPECIFICALLY FOR THE COMMON CITIZEN TO NAVIGATE COMPLEX INDIAN LEGAL PROCEDURES WITH HIGH_PRECISION CLARITY.',
    },
    {
      icon: Shield,
      title: 'CONSTITUTIONAL_MANDATE',
      description:
        'OUR INTELLIGENCE IS GROUNDED IN THE CONSTITUTION OF INDIA (BNS/IPC V2.1) AND KEY STATUTES GOVERNING DOMESTIC SECURITY.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-void pb-32 font-mono text-slate-200">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-32 space-y-24">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex p-5 rounded-sm bg-void border-2 border-gold/40 mb-6 shadow-hard"
          >
            <Scale className="w-10 h-10 text-gold" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter italic text-white leading-none"
          >
            INSTITUTIONAL <span className="text-gold">ORIGIN</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.4em] italic opacity-60"
          >
            // JUSTICE_AI_SYSTEM_CORE_V4 // ESTABLISHED_TO_BRIDGE_THE_GAP_BETWEEN_COMPLEX_PROCEDURAL_JARGON_AND_CITIZEN_SOVEREIGNTY.
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-8 rounded-sm bg-void border-2 border-white/5 space-y-6 hover:border-gold/40 transition-all group shadow-hard relative overflow-hidden"
            >
              {/* STATUTORY_CORNER_ACCENT */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/40 transition-all" />
              
              <div className="w-14 h-14 rounded-sm bg-void flex items-center justify-center border-2 border-white/10 group-hover:border-gold/40 transition-colors shadow-inner">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest italic">{feature.title}</h3>
              <p className="text-[10px] text-text-tertiary leading-loose uppercase tracking-widest italic opacity-60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 rounded-sm bg-void border-2 border-gold/15 space-y-10 shadow-hard relative"
        >
           {/* Scanning Bar Animation */}
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/20 overflow-hidden">
            <motion.div 
               animate={{ x: ['-100%', '100%'] }} 
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="w-1/3 h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]" 
            />
          </div>

          <div className="flex items-center gap-6 border-b-2 border-white/5 pb-8">
            <Shield className="w-8 h-8 text-gold" />
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tighter italic">MANDATORY_DISCLOSURE</h2>
          </div>
          <div className="space-y-6 text-[10px] text-text-tertiary leading-loose uppercase tracking-[0.2em] italic">
            <p className="opacity-80">
              JUSTICE_AI IS AN ANALYTICAL INFORMATION VECTOR POWERED BY ARTIFICIAL_INTELLIGENCE. IT IS DESIGNED FOR
              INFORMATIONAL PURPOSES ONLY. <strong className="text-gold font-extrabold underline decoration-dotted">JUSTICE_AI IS NOT A LICENSED ADVOCATE AND DOES NOT PROVIDE BINDING LEGAL COUNSEL_MANDATES.</strong>
            </p>
            <p className="opacity-60">
              WHILE WE STRIVE TO PROVIDE ACCURATE LEGAL ANALYTICS BASED ON INDIAN STATUTES, LAWS
              AND INTERPRETATIONS ARE SUBJECT TO REGULATORY CYCLES. THE PREDICTIONS AND STRATEGIES PROVIDED ARE ESTIMATES
              BY THE AI_CORE_LOGIC AND SHOULD NOT BE CONSIDERED AS A GUARANTEE OF ANY JURIDICAL OUTCOME.
            </p>
            <p className="opacity-60 border-l-4 border-gold/20 pl-8">
              ALWAYS CONSULT WITH A QUALIFIED STATUTORY_ADVOCATE OR LEGAL PROFESSIONAL BEFORE TAKING ANY
              FORMAL LEGAL STEPS, FILING CASES, OR EXECUTING LEGAL INSTRUMENTS. YOUR USE OF THIS TERMINAL
              ACKNOWLEDGES THAT YOU COMPREHEND THESE SYSTEM_LIMITATIONS.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

