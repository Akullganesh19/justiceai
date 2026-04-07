import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import Header from '../components/ui/Header';

const FAQ_DATA = [
  {
    question: 'Is JusticeAI a substitute for a real lawyer?',
    answer:
      'No. JusticeAI is an AI-powered legal co-pilot designed to provide legal information. You should always consult with a qualified advocate for real legal advice and court representation.',
  },
  {
    question: 'Which Indian laws does the AI understand?',
    answer:
      'JusticeAI has been trained on a broad range of Indian statutes, including the Indian Penal Code (IPC/BNS), Code of Civil Procedure (CPC), Consumer Protection Act, RTI Act, and specific Real Estate (RERA) and Labor laws. It also understands the latest Constitutional Amendments (up to 2024).',
  },
  {
    question: 'Does JusticeAI understand the Constitution?',
    answer:
      'Yes. JusticeAI integrates the Constitution of India (updated as of May 2024) as its primary legal framework. It can identify violations of Fundamental Rights (like Art. 21) and suggest Constitutional remedies like Writ Petitions under Art. 32 or Art. 226.',
  },
  {
    question: 'How accurate are the win/loss predictions?',
    answer:
      "The 'Verdict Prediction' is a statistical estimate based on the factors provided. It is not a guarantee of a court outcome. Legal proceedings are complex and depend on many external variables.",
  },
  {
    question: 'Can I use the generated summary in court?',
    answer:
      "The 'Legal Summary' is intended to help you organize your thoughts and prepare for your first meeting with a lawyer. It is not a formal legal pleading and should be reviewed by an advocate before being submitted to any authority.",
  },
  {
    question: 'Does JusticeAI store my private case details?',
    answer:
      "Your case data is stored locally in your browser's localStorage for your convenience. We do not store sensitive legal documents on our central servers.",
  },
  {
    question: 'Is this tool free to use?',
    answer:
      'Yes, currently JusticeAI is free for everyone as part of our mandate to improve legal access in India.',
  },
  {
    question: 'Can I handle a criminal case using JusticeAI?',
    answer:
      'JusticeAI can provide information on criminal procedure and your rights, but criminal cases carry high risks (imprisonment). We strongly recommend immediate legal counsel for any criminal matter.',
  },
  {
    question: 'How do I start a new case from scratch?',
    answer:
      "You can click the 'New Case' button in the chat workspace or navigate to the 'Samples' page to pre-load common legal scenarios.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b-2 border-white/5 last:border-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-10 px-8 text-left hover:bg-gold/[0.02] transition-colors group relative"
      >
        <span
          className={`text-xl font-display font-bold uppercase tracking-tighter italic transition-colors ${isOpen ? 'text-gold' : 'text-white group-hover:text-gold-light'}`}
        >
          <span className="opacity-20 mr-4 font-mono">//</span>
          {question}
        </span>
        <div
          className={`p-3 rounded-sm border-2 transition-all shadow-hard ${isOpen ? 'bg-gold border-gold text-white rotate-0' : 'bg-void border-white/10 text-white/20 rotate-90'}`}
        >
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-20 pb-12 text-[11px] text-text-tertiary leading-loose font-mono uppercase tracking-widest italic opacity-80 border-l-4 border-gold/20 ml-8 mb-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-void pb-32 font-mono">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-32 space-y-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-4 px-5 py-2 bg-void text-gold text-[11px] uppercase font-extrabold tracking-[0.5em] rounded-sm border-2 border-gold/40 shadow-hard italic">
            <HelpCircle className="w-5 h-5" />
            <span>OPERATIONAL_SUPPORT_REGISTRY</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter leading-none italic text-white">
            PROCEDURAL <span className="text-gold">FAQ</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.4em] italic opacity-60">
            COMPREHENSIVE STATUTORY INTELLIGENCE FOR NAVIGATING THE JUSTICEAI CORE_SYSTEM_ARCHITECTURE.
          </p>
        </div>

        <div className="bg-void rounded-sm border-2 border-white/5 overflow-hidden shadow-hard relative">
          {/* Internal Statutory Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] border-l-2 border-b-2 border-gold/[0.05] pointer-events-none" />
          
          {FAQ_DATA.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>

        <div className="text-center p-16 bg-gold/[0.03] rounded-sm border-2 border-gold/15 space-y-10 shadow-hard relative overflow-hidden group">
          {/* Diagonal Stripe Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#D4AF37_10px,#D4AF37_11px)]" />
          
          <h2 className="text-3xl font-display font-bold text-white italic uppercase tracking-tighter relative z-10">INITIALIZE_LEGAL_STRATEGY?</h2>
          <motion.a
            href="/chat"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 bg-gold text-midnight px-10 py-6 rounded-sm font-extrabold transition-all shadow-hard-gold uppercase tracking-[0.4em] italic relative z-10 active:translate-y-[2px]"
          >
            <span>LAUNCH_COMMAND_CORE</span>
            <ArrowRight className="w-6 h-6 ml-2" />
          </motion.a>
        </div>
      </main>
    </div>
  );
}
