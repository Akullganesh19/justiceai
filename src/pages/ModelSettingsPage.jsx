import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings2, 
  Cpu, 
  Cloud, 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  Save, 
  RefreshCcw,
  Key,
  Globe,
  Zap
} from 'lucide-react';
import Header from '../components/ui/Header';
import { useToast } from '../components/ui/Toast';

export default function ModelSettingsPage() {
  const { addToast } = useToast();
  
  // Settings State
  const [activeProvider, setActiveProvider] = useState('ollama');
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    deepseek: ''
  });
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(null); // null | 'ollama' | 'gemini' | 'deepseek'

  // Load settings on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('justice_ai_provider');
    const savedKeys = localStorage.getItem('justice_ai_keys');
    
    if (savedProvider) setActiveProvider(savedProvider);
    if (savedKeys) setApiKeys(JSON.parse(savedKeys));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('justice_ai_provider', activeProvider);
      localStorage.setItem('justice_ai_keys', JSON.stringify(apiKeys));
      
      // Artificial delay for industrial "crunching" feel
      await new Promise(r => setTimeout(r, 800));
      
      addToast({
        title: 'PROTOCOL_UPDATED',
        description: `Active intelligence provider shifted to ${activeProvider.toUpperCase()}.`,
        type: 'success'
      });
    } catch (e) {
      addToast({
        title: 'PROTOCOL_ERROR',
        description: 'Failed to write to local storage matrix.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (provider) => {
    setIsTesting(provider);
    try {
      // For now, we'll just simulate a ping to the backend
      const response = await fetch('http://localhost:3001/api/health');
      if (!response.ok) throw new Error('Backend Unreachable');
      
      await new Promise(r => setTimeout(r, 1200));
      
      addToast({
        title: `LINK_ESTABLISHED: ${provider.toUpperCase()}`,
        description: 'Handshake successful. Ready for legal deployment.',
        type: 'success'
      });
    } catch (e) {
      addToast({
        title: 'LINK_FAILURE',
        description: 'Could not establish connection with backend system.',
        type: 'error'
      });
    } finally {
      setIsTesting(null);
    }
  };

  return (
    <div className="min-h-screen bg-void text-white font-mono selection:bg-red/30">
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-16 relative">
          <div className="absolute -left-10 top-0 w-1 h-full bg-red opacity-30" />
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <Settings2 className="w-8 h-8 text-red" />
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              Intelligence_Selection_Terminal
            </h1>
          </motion.div>
          <p className="text-text-secondary text-sm tracking-widest uppercase font-bold opacity-60">
            Configure primary AI routing and cryptographic access keys.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Provider Selection Tier */}
          <div className="lg:col-span-2 space-y-6">
            <label className="text-[10px] uppercase font-black tracking-[0.5em] text-red-light mb-4 block">
              Active_AI_Provider_Matrix
            </label>
            
            <div className="grid gap-4">
              <ProviderCard 
                id="ollama"
                title="Openclaw (Local · gemma3:4b)"
                description="Privacy-first legal chatbot powered by Openclaw via Ollama. All inference runs locally — zero latency, zero data leakage."
                icon={<Cpu className="w-5 h-5" />}
                active={activeProvider === 'ollama'}
                onClick={setActiveProvider}
                status="ACTIVE"
              />
              <ProviderCard 
                id="gemini"
                title="Google Gemini"
                description="High-speed cloud extraction. Requires API key fallback."
                icon={<Cloud className="w-5 h-5" />}
                active={activeProvider === 'gemini'}
                onClick={setActiveProvider}
                status="CLOUD"
              />
              <ProviderCard 
                id="deepseek"
                title="DeepSeek AI"
                description="Advanced tactical reasoning. High intelligence cloud secondary."
                icon={<Database className="w-5 h-5" />}
                active={activeProvider === 'deepseek'}
                onClick={setActiveProvider}
                status="CLOUD"
              />
            </div>

            {/* API Key Configuration Section */}
            <AnimatePresence mode="wait">
              {activeProvider !== 'ollama' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 bg-void border-2 border-white/5 rounded-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-red/5 skew-x-12 translate-x-32" />
                  
                  <div className="flex items-center gap-3 mb-8">
                    <Key className="w-5 h-5 text-red" />
                    <h3 className="text-lg font-bold uppercase tracking-tight italic">
                      Credential_Management
                    </h3>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">
                        {activeProvider === 'gemini' ? 'Gemini_API_Key' : 'DeepSeek_API_Key'}
                      </label>
                      <div className="relative group">
                        <input 
                          type="password"
                          value={activeProvider === 'gemini' ? apiKeys.gemini : apiKeys.deepseek}
                          onChange={(e) => setApiKeys(prev => ({
                            ...prev,
                            [activeProvider]: e.target.value
                          }))}
                          className="w-full bg-black/40 border-2 border-white/10 p-4 font-mono text-sm focus:border-red/50 focus:outline-none transition-all rounded-sm tracking-widest"
                          placeholder="••••••••••••••••••••••••••••••••"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <ShieldCheck className="w-4 h-4 text-accent-success opacity-50" />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => testConnection(activeProvider)}
                      disabled={isTesting}
                      className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-blue hover:text-white transition-colors group"
                    >
                      {isTesting === activeProvider ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 group-hover:animate-pulse" />
                      )}
                      <span>Ping_{activeProvider.toUpperCase()}_Service</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Tier */}
          <div className="space-y-6">
            <div className="p-8 bg-void/5 border-2 border-white/10 rounded-sm space-y-8 sticky top-32 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.4)]">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-[0.4em] text-text-tertiary block">
                  System_Status
                </label>
                <div className="space-y-3">
                  <StatusLine label="Backend_Link" active={true} />
                  <StatusLine label="Vector_DB" active={true} />
                  <StatusLine label="Failover_Chain" active={true} />
                </div>
              </div>

              <div className="h-[1px] bg-void/10" />

              <div className="space-y-4">
                <p className="text-[11px] text-text-secondary leading-relaxed italic">
                  Changes to provider routing will take effect immediately upon deployment to the active legal session.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-red text-white p-5 rounded-sm flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>Deploy_Configuration</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProviderCard({ id, title, description, icon, active, onClick, status }) {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      onClick={() => onClick(id)}
      className={`p-6 rounded-sm border-2 cursor-pointer transition-all relative group overflow-hidden ${
        active 
          ? 'bg-red/10 border-red shadow-[8px_8px_0px_0px_rgba(225,29,72,0.1)]' 
          : 'bg-void border-white/10 hover:border-white/30'
      }`}
    >
      <div className="flex items-center gap-5 relative z-10">
        <div className={`p-3 rounded-sm ${active ? 'bg-red text-white' : 'bg-void/5 text-text-tertiary'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`font-black uppercase tracking-tighter ${active ? 'text-white' : 'text-text-secondary'}`}>
              {title}
            </h3>
            {active && (
              <span className="text-[9px] bg-red/20 text-red px-2 py-0.5 rounded-full font-bold animate-pulse">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-text-tertiary leading-relaxed">
            {description}
          </p>
        </div>
        <div className="text-[10px] font-black tracking-widest text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
          [{status}]
        </div>
      </div>
      
      {active && (
        <div className="absolute top-0 right-0 p-2">
          <ShieldCheck className="w-4 h-4 text-red" />
        </div>
      )}
    </motion.div>
  );
}

function StatusLine({ label, active }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-text-secondary font-bold uppercase tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-accent-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-void/10'}`} />
        <span className={`text-[10px] font-black ${active ? 'text-accent-success' : 'text-white/10'}`}>
          {active ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>
    </div>
  );
}
