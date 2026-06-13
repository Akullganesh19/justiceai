import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Shield,
  ShoppingBag,
  Users,
  ArrowRight,
  Sparkles,
  UserCheck,
  Cpu,
  User
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { AGENTS } from '../data/agents';

const iconMap = {
  Home: Home,
  Shield: Shield,
  ShoppingBag: ShoppingBag,
  Users: Users,
};

function AgentCard({ agent, index }) {
  const navigate = useNavigate();
  const Icon = iconMap[agent.icon] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate('/chat', { state: { selectedAgent: agent } })}
      className="group cursor-pointer p-8 rounded-sm bg-void border-2 border-white/5 hover:border-gold/30 transition-all duration-500 space-y-6 shadow-hard relative overflow-hidden"
    >
      <div className={`w-14 h-14 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500 shadow-hard`}>
        <Icon className={`w-7 h-7 ${agent.color || 'text-gold'}`} />
      </div>
      <div>
        <h3 className="text-xl font-display font-bold text-white uppercase tracking-widest group-hover:text-gold transition-colors italic">
          {agent.name}
        </h3>
        <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-1 opacity-60">
          {agent.specialization}
        </p>
      </div>
      <p className="text-xs text-text-tertiary font-body leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
        {agent.description}
      </p>
      <div className="flex items-center gap-4 text-[10px] font-extrabold text-gold uppercase tracking-[0.4em] group-hover:gap-6 transition-all italic">
        <span>Initialize Agent</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}

export default function AgentsHubPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-void font-mono text-slate-200">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-24">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-4 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[11px] uppercase font-extrabold tracking-[0.4em] rounded-sm shadow-hard italic">
              <Sparkles className="w-5 h-5" />
              <span>INTELLIGENCE_ROUTING_HUB_V1.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white italic">
              AI <span className="text-gold">AGENTS</span>
            </h1>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-xl mx-auto md:mx-0 opacity-40 uppercase tracking-[0.2em] italic">
              CHOOSE FROM SPECIALIZED AI AGENTS FOR DEEP STATUTORY ANALYSIS OR CONNECT WITH IN-PERSON LEGAL PROFESSIONALS.
            </p>
          </div>
        </div>

        {/* AI Agents Grid */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-gold shadow-luxe" />
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white">
              SPECIALIZED_AI_INSTANCES
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {AGENTS.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </section>

        {/* In-Person Section */}
        <section className="space-y-12 pt-12 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-blue-400 shadow-luxe" />
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white">
              IN_PERSON_EXPERTISE
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ x: 8 }}
              onClick={() => navigate('/lawyers')}
              className="p-10 rounded-sm bg-void border-2 border-blue-400/20 hover:border-blue-400 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-sm bg-void border-2 border-blue-400/20 flex items-center justify-center group-hover:bg-blue-400/5 transition-all">
                  <User className="w-10 h-10 text-blue-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-3xl font-display font-bold text-white uppercase italic">
                    Human <span className="text-blue-400">Advocates</span>
                  </h3>
                  <p className="text-sm text-text-tertiary leading-relaxed opacity-60">
                    Connect with verified legal professionals for physical representation, court appearances, and complex litigation strategy.
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-extrabold text-blue-400 uppercase tracking-[0.4em] group-hover:gap-6 transition-all italic">
                    <span>Access Registry</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="p-10 rounded-sm bg-void border-2 border-white/5 flex items-center justify-center text-center italic relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
               <p className="text-[11px] text-text-tertiary uppercase tracking-widest font-bold opacity-40 max-w-sm">
                 // HYBRID_MODEL_NOTICE: AI AGENTS PROVIDE PRELIMINARY STATUTORY ANALYSIS. COMPLEX PROCEDURAL MATTERS REQUIRE IN-PERSON LEGAL COUNSEL.
               </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
