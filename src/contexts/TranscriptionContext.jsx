import React, { createContext, useContext, useState, useCallback } from 'react';

const TranscriptionContext = createContext(null);

export function TranscriptionProvider({ children }) {
  const [transcriptionData, setTranscriptionData] = useState({ text: '', timestamp: 0 });

  const dispatchTranscription = useCallback((text) => {
    setTranscriptionData({ text, timestamp: Date.now() });

    // Additive migration: also dispatch the legacy event for any unmigrated components
    // TODO: Remove this legacy event dispatch once all components are migrated to useTranscription
    const event = new CustomEvent('justice-ai-transcription', { detail: { text } });
    window.dispatchEvent(event);
  }, []);

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
