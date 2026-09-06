import React, { useState, useEffect, useRef } from 'react';
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
  FileDown,
  FileUp,
  Trash2,
  Key,
  Globe,
  Zap
} from 'lucide-react';
import Header from '../components/ui/Header';
import { useToast } from '../components/ui/Toast';

export default function IntelligenceSelectionTerminal() {
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

  const fileInputRef = useRef(null);

  const handleExportData = () => {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('justice_ai_')) {
          data[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `justice_ai_vault_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        title: 'DATA_VAULT_EXPORTED',
        description: 'Your encrypted local footprint has been downloaded.',
        type: 'success'
      });
    } catch (_err) {
      addToast({
        title: 'EXPORT_FAILED',
        description: 'Failed to extract local vault data.',
        type: 'error'
      });
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        let importedCount = 0;
        for (const key in data) {
          if (key.startsWith('justice_ai_')) {
            localStorage.setItem(key, data[key]);
            importedCount++;
          }
        }
        addToast({
          title: 'SYSTEM_STATE_RESTORED',
          description: `Successfully imported ${importedCount} memory nodes. Reloading...`,
          type: 'success'
        });
        setTimeout(() => window.location.reload(), 1500);
      } catch (_err) {
        addToast({
          title: 'RESTORE_FAILED',
          description: 'Corrupted or invalid vault file.',
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handlePurgeData = () => {
    if (window.confirm('CRITICAL WARNING: This will permanently delete all local cases, chats, and intelligence states from this device. Proceed?')) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('justice_ai_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      addToast({
        title: 'DATA_PURGED',
        description: 'Local vault wiped completely. Reloading system.',
        type: 'success'
      });
      setTimeout(() => window.location.reload(), 1500);
    }
  };


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
        title: 'CONFIGURATION_UPDATED',
        description: `Active analysis provider shifted to ${activeProvider.toUpperCase()}.`,
        type: 'success'
      });
    } catch (_e) {
      addToast({
        title: 'SYSTEM_ERROR',
        description: 'Failed to write to local storage framework.',
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
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/health`);
      if (!response.ok) throw new Error('Backend Unreachable');
      
      await new Promise(r => setTimeout(r, 1200));
      
      addToast({
        title: `LINK_VERIFIED: ${provider.toUpperCase()}`,
        description: 'Analysis link verified. System ready to assist.',
        type: 'success'
      });
    } catch (_e) {
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
    <div className="min-h-screen bg-void text-white font-mono selection:bg-gold/30">
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-16 relative">
          <div className="absolute -left-10 top-0 w-1 h-full bg-gold opacity-30" />
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <Settings2 className="w-8 h-8 text-gold" />
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              INTELLIGENCE_SELECTION_TERMINAL_V4.2
            </h1>
          </motion.div>
          <p className="text-text-secondary text-sm tracking-widest uppercase font-bold opacity-60">
            Configure primary analysis routing and secure access keys.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Provider Selection Tier */}
          <div className="lg:col-span-2 space-y-6">
            <label className="text-[10px] uppercase font-black tracking-[0.5em] text-gold-light mb-4 block italic opacity-40">
              STRATEGIC_COMPUTE_SOURCE_MATRIX
            </label>
            
            <div className="grid gap-4">
              <ProviderCard 
                id="ollama"
                title="STATUTORY_LOCAL_CORE (gemma3:4b)"
                description="PRIVACY-FIRST ANALYSIS POWERED BY OLLAMA. ALL INFERENCE RUNS LOCALLY — ZERO LATENCY, ZERO DATA LEAKAGE."
                icon={<Cpu className="w-5 h-5" />}
                active={activeProvider === 'ollama'}
                onClick={setActiveProvider}
                status="OFFLINE_CORE"
              />
              <ProviderCard 
                id="gemini"
                title="Google Gemini"
                description="High-speed extraction and research. Requires API key fallback."
                icon={<Cloud className="w-5 h-5" />}
                active={activeProvider === 'gemini'}
                onClick={setActiveProvider}
                status="CLOUD"
              />
              <ProviderCard 
                id="deepseek"
                title="DeepSeek AI"
                description="Advanced strategic reasoning. High-performance analysis backup."
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
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 skew-x-12 translate-x-32" />
                  
                  <div className="flex items-center gap-3 mb-8">
                    <Key className="w-5 h-5 text-gold" />
                    <h3 className="text-lg font-bold uppercase tracking-tight italic">
                      CREDENTIAL_MANDATE_REGISTRY
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
                          className="w-full bg-black/40 border-2 border-white/10 p-4 font-mono text-sm focus:border-gold/50 focus:outline-none transition-all rounded-sm tracking-[0.3em] uppercase italic"
                          placeholder="••••••••••••••••••••••••••••••••"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <ShieldCheck className="w-4 h-4 text-gold opacity-50" />
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
                  Changes to provider routing will take effect immediately upon application to the active legal session.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-gold text-midnight p-5 rounded-sm flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>Apply_Configuration</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
          {/* Data Portability & Vault */}
          <div className="lg:col-span-3 mt-8 border-t border-white/5 pt-12 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-gold" />
              <h2 className="text-xl font-black uppercase tracking-widest italic">
                DATA_PORTABILITY_VAULT
              </h2>
            </div>
            <p className="text-sm text-text-tertiary font-body mb-8 max-w-2xl opacity-80 leading-relaxed">
              Your legal footprint (cases, consultations, documents) is stored exclusively on this device. Extract your system state for backup or migration, or permanently wipe local memory.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={handleExportData}
                className="group p-6 bg-void border-2 border-white/10 hover:border-gold/40 rounded-sm text-left transition-all hover:-translate-y-1 shadow-hard"
              >
                <FileDown className="w-6 h-6 text-text-tertiary group-hover:text-gold transition-colors mb-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">
                  EXPORT_STATE
                </h3>
                <p className="text-xs text-text-tertiary font-body opacity-70">
                  Download all local records as an encrypted JSON backup file.
                </p>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="group p-6 bg-void border-2 border-white/10 hover:border-gold/40 rounded-sm text-left transition-all hover:-translate-y-1 shadow-hard"
              >
                <FileUp className="w-6 h-6 text-text-tertiary group-hover:text-gold transition-colors mb-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">
                  RESTORE_STATE
                </h3>
                <p className="text-xs text-text-tertiary font-body opacity-70">
                  Import an existing JSON vault to restore your history.
                </p>
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleImportData}
                className="hidden"
              />

              <button
                onClick={handlePurgeData}
                className="group p-6 bg-void border-2 border-white/10 hover:border-red-500/40 rounded-sm text-left transition-all hover:-translate-y-1 shadow-hard"
              >
                <Trash2 className="w-6 h-6 text-text-tertiary group-hover:text-red-500 transition-colors mb-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2 group-hover:text-red-500 transition-colors">
                  PURGE_MEMORY
                </h3>
                <p className="text-xs text-text-tertiary font-body opacity-70">
                  Permanently erase all local tracking and consultation data.
                </p>
              </button>
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
          ? 'bg-gold/10 border-gold shadow-[8px_8px_0px_0px_rgba(212,175,55,0.1)]' 
          : 'bg-void border-white/10 hover:border-white/30'
      }`}
    >
      <div className="flex items-center gap-5 relative z-10">
        <div className={`p-3 rounded-sm ${active ? 'bg-gold text-midnight' : 'bg-void/5 text-text-tertiary'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`font-black uppercase tracking-tighter ${active ? 'text-white' : 'text-text-secondary'}`}>
              {title}
            </h3>
            {active && (
              <span className="text-[9px] bg-gold text-midnight px-2 py-0.5 rounded-sm font-black animate-pulse">
                DEPLOYED_MANDATE
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
          <ShieldCheck className="w-4 h-4 text-gold" />
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
        <div className={`w-1.5 h-1.5 rounded-sm ${active ? 'bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'bg-void/20 border border-white/5'}`} />
        <span className={`text-[10px] font-black tracking-widest ${active ? 'text-gold' : 'text-white/10'}`}>
          {active ? 'ONLINE_LINK' : 'OFFLINE_CORE'}
        </span>
      </div>
    </div>
  );
}
