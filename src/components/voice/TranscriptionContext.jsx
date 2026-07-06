import React, { createContext, useContext, useState, useEffect } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcription, setTranscription] = useState(null);

  useEffect(() => {
    let counter = 0;

    const handleTranscription = (e) => {
      if (e.detail?.text) {
        setTranscription({
          text: e.detail.text,
          timestamp: ++counter
        });
      }
    };

    window.addEventListener('justice-ai-transcription', handleTranscription);
    return () => window.removeEventListener('justice-ai-transcription', handleTranscription);
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
