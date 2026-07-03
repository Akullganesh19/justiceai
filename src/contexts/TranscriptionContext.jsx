import React, { createContext, useContext, useState } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcriptionData, setTranscriptionData] = useState(null);

  const dispatchTranscription = (text) => {
    setTranscriptionData({ text, timestamp: Date.now() });
  };

  return (
    <TranscriptionContext.Provider value={{ transcriptionData, dispatchTranscription }}>
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
