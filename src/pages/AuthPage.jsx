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
          className="group flex items-center gap-3 px-4 py-2 rounded-full bg-void/5 border border-white/10 hover:border-purple/40 hover:bg-void/10 transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-purple group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary group-hover:text-white transition-colors">
            Back to Home
          </span>
        </button>
      </div>

      {/* Brand Watermark for Mobile */}
      <div className="lg:hidden fixed top-8 right-8 z-50">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple" />
          <span className="font-display text-lg font-bold text-white tracking-tight">
            JusticeAI
          </span>
        </div>
      </div>

      {/* Main UI */}
      <AuthUI />

      {/* Bottom Legal Attribution */}
      <div className="fixed bottom-6 right-8 z-50 hidden lg:block">
        <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-text-tertiary">
          System: <span className="text-purple">Citizen's Counsel</span> Legal Link // Secure
        </p>
      </div>
    </div>
  );
}
