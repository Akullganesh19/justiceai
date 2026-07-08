import React, { createContext, useContext, useState, useEffect } from 'react';

const TranscriptionContext = createContext(null);

let counter = 0;

export function TranscriptionProvider({ children }) {
  const [transcriptionEvent, setTranscriptionEvent] = useState(null);

  useEffect(() => {
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
    <TranscriptionContext.Provider value={transcriptionEvent}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscription() {
  const context = useContext(TranscriptionContext);
  // Allow returning null if outside provider (or if no event yet)
  return context;
}
