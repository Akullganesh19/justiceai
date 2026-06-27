import React, { createContext, useContext, useState, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export const TranscriptionProvider = ({ children }) => {
  const [transcription, setTranscription] = useState(null);

  const addTranscription = useCallback((text) => {
    setTranscription({
      text,
      timestamp: Date.now()
    });
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcription, addTranscription }}>
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
};
