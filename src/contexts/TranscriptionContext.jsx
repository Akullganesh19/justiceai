import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcription, setTranscription] = useState(null);
  const transcriptionIdRef = useRef(0);

  const addTranscription = useCallback((text) => {
    transcriptionIdRef.current += 1;
    setTranscription({
      text,
      timestamp: Date.now(),
      id: transcriptionIdRef.current,
    });
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcription, addTranscription }}>
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
