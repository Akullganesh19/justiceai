import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
};

export const TranscriptionProvider = ({ children }) => {
  const [transcriptionData, setTranscriptionData] = useState(null);

  // Track consumed transcriptions to avoid replay bugs
  const consumedIdsRef = useRef(new Set());

  const dispatchTranscription = useCallback((text) => {
    setTranscriptionData({
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      text,
      timestamp: Date.now(),
    });
  }, []);

  const clearTranscription = useCallback((id) => {
    if (id) {
        consumedIdsRef.current.add(id);
    }
    setTranscriptionData(null);
  }, []);

  const isConsumed = useCallback((id) => {
      return consumedIdsRef.current.has(id);
  }, []);

  return (
    <TranscriptionContext.Provider value={{ transcriptionData, dispatchTranscription, clearTranscription, isConsumed }}>
      {children}
    </TranscriptionContext.Provider>
  );
};
