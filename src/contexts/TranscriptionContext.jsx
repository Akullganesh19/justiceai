import React, { createContext, useContext, useState, useRef } from 'react';

const TranscriptionContext = createContext(null);

export const TranscriptionProvider = ({ children }) => {
  const [transcriptionState, setTranscriptionState] = useState(null);

  // Use to track when a transcription has been processed by a component
  // to avoid replay bugs when components remount
  const setTranscription = (text) => {
    setTranscriptionState({ text, timestamp: Date.now() });
  };

  const clearTranscription = () => {
    setTranscriptionState(null);
  };

  return (
    <TranscriptionContext.Provider value={{
      transcription: transcriptionState?.text || null,
      transcriptionTimestamp: transcriptionState?.timestamp || null,
      setTranscription,
      clearTranscription
    }}>
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
