import React, { createContext, useContext, useState, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcriptionData, setTranscriptionData] = useState({ text: null, id: null });

  const setTranscription = useCallback((text) => {
    if (text) {
      setTranscriptionData({ text, id: crypto.randomUUID() });
    }
  }, []);

  const clearTranscription = useCallback(() => {
    setTranscriptionData({ text: null, id: null });
  }, []);

  const value = {
    transcriptionData,
    setTranscription,
    clearTranscription,
  };

  return (
    <TranscriptionContext.Provider value={value}>
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
