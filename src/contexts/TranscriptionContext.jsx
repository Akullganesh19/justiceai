import React, { createContext, useContext, useState, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [globalTranscription, setGlobalTranscriptionState] = useState(null);

  const setGlobalTranscription = useCallback((text) => {
    setGlobalTranscriptionState({
      text,
      timestamp: Date.now()
    });
  }, []);

  const clearGlobalTranscription = useCallback(() => {
    setGlobalTranscriptionState(null);
  }, []);

  return (
    <TranscriptionContext.Provider
      value={{
        globalTranscription,
        setGlobalTranscription,
        clearGlobalTranscription
      }}
    >
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
