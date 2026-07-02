import React, { createContext, useContext, useState, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcription, setTranscription] = useState({ text: '', timestamp: 0 });

  const setGlobalTranscription = useCallback((text) => {
    setTranscription({ text, timestamp: Date.now() });
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcription, setGlobalTranscription }}>
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
