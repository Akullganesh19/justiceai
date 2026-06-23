import React, { createContext, useContext, useState, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcriptionPayload, setTranscriptionPayload] = useState(null);

  const addTranscription = useCallback((text) => {
    setTranscriptionPayload({ text, timestamp: Date.now() });
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcriptionPayload, addTranscription }}>
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
