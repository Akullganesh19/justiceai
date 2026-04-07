import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { AuthUI } from '../components/ui/auth-fuse';

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-void">
      {/* Navigation Layer */}
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 px-6 py-3 rounded-sm bg-void border-2 border-white/5 hover:border-gold/40 hover:bg-gold/5 transition-all backdrop-blur-md shadow-hard italic"
        >
          <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-text-secondary group-hover:text-gold transition-all">
            RETURN_TO_BASE
          </span>
        </button>
      </div>

      {/* Brand Watermark for Mobile */}
      <div className="lg:hidden fixed top-8 right-8 z-50">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-gold" />
          <span className="font-display text-lg font-bold text-white tracking-widest uppercase italic">
            JusticeAI
          </span>
        </div>
      </div>

      {/* Main UI */}
      <AuthUI />

      {/* Bottom Legal Attribution */}
      <div className="fixed bottom-6 right-8 z-50 hidden lg:block">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-text-tertiary italic">
          SYSTEM_NODE: <span className="text-gold">CITIZEN_COUNSEL_v4.2</span> // SECURE_HANDSHAKE
        </p>
      </div>
    </div>
  );
}
