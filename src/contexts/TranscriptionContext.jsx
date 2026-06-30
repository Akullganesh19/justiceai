import React, { createContext, useContext, useState, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcriptionData, setTranscriptionData] = useState(null);

  const dispatchTranscription = useCallback((text) => {
    // Include a timestamp so identical transcriptions can be processed as new events
    setTranscriptionData({ text, timestamp: Date.now() });
  }, []);

  const clearTranscription = useCallback(() => {
    setTranscriptionData(null);
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcriptionData, dispatchTranscription, clearTranscription }}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscription() {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
}
