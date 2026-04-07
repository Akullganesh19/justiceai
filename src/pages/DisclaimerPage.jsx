import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Milestone, Scale, FileWarning, Info } from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function DisclaimerPage() {
  const sections = [
    {
      icon: Info,
      title: 'NO_LEGAL_ADVICE',
      content:
        'JUSTICEAI IS AN ARTIFICIAL_INTELLIGENCE VECTOR DESIGNED FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY. THE OUTPUTS, ANALYSES, AND GENERATED DATASETS DO NOT CONSTITUTE BINDING LEGAL COUNSEL UNDER THE ADVOCATES ACT, 1961.',
    },
    {
      icon: ShieldAlert,
      title: 'NO_ADVOCATE_CLIENT_PROTOCOL',
      content:
        'USE OF THIS TERMINAL, INCLUDING THE AI_CHAT AND DOCUMENT_ENGINE, DOES NOT ESTABLISH AN ADVOCATE_CLIENT RELATIONSHIP MANDATE. FOR SPECIFIC LEGAL PROBLEMS, ALWAYS CONSULT WITH A QUALIFIED BUREAU_ADVOCATE REGISTERED WITH THE BAR COUNCIL.',
    },
    {
      icon: Milestone,
      title: 'BNS_2023_TRANSITION_LAG',
      content:
        'WHILE JUSTICEAI IS CURRENTLY BEING UPDATED TO REFLECT THE BHARATIYA NYAYA SANHITA (BNS) PROTOCOLS, USERS ARE CAUTIONED THAT JUDICIAL INTERPRETATION OF THESE NEW LAWS IS EVOLVING. ALWAYS VERIFY CRITICAL CITATIONS WITH THE OFFICIAL GAZETTE.',
    },
    {
      icon: FileWarning,
      title: 'ACCURACY_MANDATE_LIABILITY',
      content:
        'LEGAL_TECH IS AN ANALYTICAL AID, NOT A REPLACEMENT FOR JURIDICAL JUDGMENT. JUSTICEAI ASSUMES NO LIABILITY FOR ANY ACTIONS TAKEN BASED ON ITS AI_OUTPUTS. USERS ARE RESPONSIBLE FOR VERIFYING ALL DOCUMENT FILINGS.',
    },
  ];

  return (
    <div className="min-h-screen bg-void flex flex-col font-mono">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-4 px-5 py-2 bg-void text-gold text-[11px] uppercase font-extrabold tracking-[0.5em] rounded-sm border-2 border-gold/40 shadow-hard italic">
              <AlertTriangle className="w-5 h-5" />
              <span>LEGAL_DISCLAIMER_INDEX_V4.2</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none italic text-white">
              SERVICE <span className="text-gold">DISCLOSURE</span>
            </h1>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.4em] italic opacity-60">
              CRITICAL OPERATIONAL BOUNDARIES OF AI_DRIVEN LEGAL INTELLIGENCE AND SYSTEM_LIMITATIONS.
            </p>
          </div>

          <div className="grid gap-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-sm bg-void border-2 border-white/5 flex flex-col md:flex-row gap-8 items-start hover:border-red/40 transition-all group shadow-hard relative overflow-hidden"
              >
                {/* Statutory Accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gold/10 group-hover:bg-gold transition-all" />
                
                <div className="w-16 h-16 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-gold/40 transition-all shadow-inner">
                  <section.icon className="w-8 h-8 text-gold" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-display font-bold text-white uppercase tracking-tighter italic">{section.title}</h3>
                  <p className="text-[11px] text-text-tertiary leading-loose uppercase tracking-widest italic opacity-60">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-12 rounded-sm bg-gold/[0.03] border-2 border-gold/15 text-center space-y-6 shadow-hard relative overflow-hidden">
             {/* Diagonal Stripes */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#d4af37_10px,#d4af37_11px)]" />
             
            <p className="text-[12px] text-text-tertiary uppercase tracking-[0.6em] italic font-bold opacity-80 relative z-10 leading-relaxed">
              "JUSTICE IS THE CONSTANT AND PERPETUAL WILL TO ALLOT TO EVERY MAN HIS DUE."
            </p>
            <p className="text-[11px] uppercase tracking-[0.4em] font-extrabold text-gold relative z-10">
              — ULPIAN, ROMAN_JURIST_REF_ALPHA
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
