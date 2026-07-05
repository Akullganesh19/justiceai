import React, { createContext, useContext, useState, useEffect } from 'react';

const VoiceContext = createContext();

export function VoiceProvider({ children }) {
  const [transcriptionData, setTranscriptionData] = useState({ text: null, timestamp: 0 });

  useEffect(() => {
    let counter = 0;
    const handleTranscription = (e) => {
      if (e.detail?.text) {
        setTranscriptionData({ text: e.detail.text, timestamp: ++counter });
      }
    };

    window.addEventListener('justice-ai-transcription', handleTranscription);
    return () => window.removeEventListener('justice-ai-transcription', handleTranscription);
  }, []);

  return (
    <VoiceContext.Provider value={{ transcriptionData }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoiceContext() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoiceContext must be used within a VoiceProvider');
  }
  return context;
}
