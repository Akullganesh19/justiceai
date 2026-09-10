import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import CommandPalette from './CommandPalette';
import FloatingVoiceButton from '../voice/FloatingVoiceButton';

const handleGlobalTranscription = (text) => {
  // Dispatch a custom event that any page (like ChatPage) can listen for
  const event = new CustomEvent('justice-ai-transcription', { detail: { text } });
  window.dispatchEvent(event);
};

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center space-y-6 font-mono">
      <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-sm animate-spin shadow-luxe" />
      <p className="text-[10px] text-gold font-extrabold uppercase tracking-[0.4em] animate-pulse italic">
        INITIALIZING_SYSTEM_CORE...
      </p>
    </div>
  );
}

export default function RootLayout() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollToTop />
      <CommandPalette />
      <FloatingVoiceButton onTranscription={handleGlobalTranscription} />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
}
