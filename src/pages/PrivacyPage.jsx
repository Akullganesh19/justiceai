import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Database, UserCheck, EyeOff, Scale, Server, Terminal, Zap } from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: 'LOCAL_FIRST_STORAGE_STREAMS',
      content:
        "CASE_DATA AND GENERATED_DOCUMENTS STORED IN BROWSER_LOCAL_LAYER. COMPLETE SOVEREIGNTY OVER SENSITIVE LEGAL METADATA.",
    },
    {
      icon: ShieldCheck,
      title: 'DPDP_ACT_2023_COMPLIANCE_ALPHA',
      content:
        'ENGINEERED PER DIGITAL_PERSONAL_DATA_PROTECTION_ACT (2023) PRINCIPLES. MANDATORY DATA_MINIMIZATION AND PURPOSE_LIMITATION FOR ALL AI FLOWS.',
    },
    {
      icon: EyeOff,
      title: 'ANONYMIZED_ANALYTICAL_TRAJECTORY',
      content:
        'QUERIES ARE ANONYMIZED BEFORE VECTOR_PROCESSING. ZERO_STORAGE OF PII ON HOST_SERVERS UNLESS EXPLICITLY PROTOCOL-REQUESTED.',
    },
    {
      icon: Lock,
      title: 'ENCRYPTED_EXPORT_SIGNATURES',
      content:
        'ALL SUMMARIES AND EXPORTS SIGNED WITH RSA_PROTOCOL DURING TRANSMISSION. ZERO BACK-DOOR ACCESS TO PRIVATE STRATEGIES.',
    },
  ];

  return (
    <div className="min-h-screen bg-void flex flex-col font-mono">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-void border-2 border-gold/40 text-gold text-[10px] uppercase font-extrabold tracking-[0.4em] italic rounded-sm shadow-hard">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>ENCRYPTION_LAYER_V4.2</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tighter italic leading-none">
              SHIELDING <span className="text-gold">SOVEREIGNTY</span>
            </h1>
            <p className="text-xs text-text-tertiary font-body uppercase tracking-[0.2em] max-w-2xl mx-auto italic opacity-60">
              LEGAL INFORMATION IS THE MOST SENSITIVE VECTOR. WE DEPLOY SECURE STRATA TO PROTECT STRATEGY, IDENTITY, AND CITIZEN_RIGHTS.
            </p>
          </div>

          <div className="grid gap-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-sm bg-void border-2 border-white/5 flex flex-col md:flex-row gap-8 items-start hover:border-gold/20 transition-all group shadow-hard active:translate-y-[2px]"
              >
                <div className="w-16 h-16 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-gold/40 transition-all shadow-hard">
                  <section.icon className="w-8 h-8 text-gold" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight italic">{section.title}</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed font-body uppercase tracking-wider italic opacity-60">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Secure Infrastructure Section */}
          <div className="p-12 rounded-sm bg-void border-2 border-gold/[0.15] relative overflow-hidden shadow-hard active:translate-y-[4px] transition-all group">
             {/* Statutory Grid Background Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Server className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <Terminal className="w-6 h-6 text-gold" />
                <h3 className="text-2xl font-display font-bold text-white uppercase italic tracking-tighter">TRUST_INFRASTRUCTURE_MODULE</h3>
              </div>
              <p className="text-sm text-text-tertiary leading-relaxed max-w-2xl font-body uppercase tracking-widest italic opacity-80">
                PROMPT_FLOWS SERVED VIA DEDICATED VPC INSTANCES EXCLUSIVE TO AUTHORITY_NETWORK. ZERO EXTERNAL EXIT POINTS. FIREWALLED ANALYTICAL CYLES ENSURE 100% STRATEGY ENCAPSULATION. SOC2_TYPE_II PRINCIPLES ENFORCED.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
