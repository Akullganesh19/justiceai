import React, { createContext, useContext, useState, useEffect } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcription, setTranscription] = useState(null);

  useEffect(() => {
    const handleGlobalEvent = (e) => {
      if (e.detail?.text) {
        setTranscription({ text: e.detail.text, timestamp: Date.now() });
      }
    };

    window.addEventListener('justice-ai-transcription', handleGlobalEvent);
    return () => window.removeEventListener('justice-ai-transcription', handleGlobalEvent);
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcription }}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscription() {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
}
