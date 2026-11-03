import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../ui/ScrollToTop';
import CommandPalette from '../ui/CommandPalette';
import FloatingVoiceButton from '../voice/FloatingVoiceButton';

const handleGlobalTranscription = (text) => {
  // Dispatch a custom event that any page (like ChatPage) can listen for
  const event = new CustomEvent('justice-ai-transcription', { detail: { text } });
  window.dispatchEvent(event);
};

export default function RootLayout({ fallback }) {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollToTop />
      <CommandPalette />
      <FloatingVoiceButton onTranscription={handleGlobalTranscription} />
      <Suspense fallback={fallback}>
        <Outlet />
      </Suspense>
    </>
  );
}
