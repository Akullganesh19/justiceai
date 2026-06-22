import React, { createContext, useContext, useState, useCallback } from 'react';

const VoiceTranscriptionContext = createContext({
  transcription: '',
  dispatchTranscription: () => {},
  consumeTranscription: () => {},
});

export const VoiceTranscriptionProvider = ({ children }) => {
  const [transcription, setTranscription] = useState('');

  const dispatchTranscription = useCallback((text) => {
    setTranscription((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  const consumeTranscription = useCallback(() => {
    const current = transcription;
    setTranscription('');
    return current;
  }, [transcription]);

  return (
    <VoiceTranscriptionContext.Provider value={{ transcription, dispatchTranscription, consumeTranscription }}>
      {children}
    </VoiceTranscriptionContext.Provider>
  );
};

export const useVoiceTranscription = () => useContext(VoiceTranscriptionContext);
