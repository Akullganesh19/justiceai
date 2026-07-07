import React, { createContext, useContext, useEffect, useState } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcriptionEvent, setTranscriptionEvent] = useState(null);

  useEffect(() => {
    let counter = 0;

    const handleTranscription = (e) => {
      if (e.detail?.text) {
        setTranscriptionEvent({
          text: e.detail.text,
          timestamp: ++counter
        });
      }
    };

    window.addEventListener('justice-ai-transcription', handleTranscription);
    return () => window.removeEventListener('justice-ai-transcription', handleTranscription);
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcriptionEvent }}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscription() {
  const context = useContext(TranscriptionContext);
  if (context === null) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
}
