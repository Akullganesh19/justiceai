import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Globe, X, Send, Play, Square, Loader2, Zap } from 'lucide-react';

const BHASHINI_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'or', name: 'Odia' },
  { code: 'as', name: 'Assamese' },
  { code: 'ur', name: 'Urdu' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'gom', name: 'Konkani' },
  { code: 'brx', name: 'Bodo' },
  { code: 'doi', name: 'Dogri' },
  { code: 'mai', name: 'Maithili' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'sat', name: 'Santali' },
  { code: 'bho', name: 'Bhojpuri' },
  { code: 'tcy', name: 'Tulu' },
  { code: 'raj', name: 'Rajasthani' },
  { code: 'bgc', name: 'Haryanvi' },
  { code: 'hne', name: 'Chhattisgarhi' },
  { code: 'mag', name: 'Magahi' },
  { code: 'anp', name: 'Angika' },
  { code: 'kmu', name: 'Kumaoni' },
  { code: 'gbm', name: 'Garhwali' },
  { code: 'awa', name: 'Awadhi' },
  { code: 'mwr', name: 'Marwari' },
  { code: 'mww', name: 'Mewati' },
  { code: 'mup', name: 'Malvi' },
];

export default function FloatingVoiceButton({ onTranscription }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('hi');
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      const startTime = Date.now();
      mediaRecorder.start(1000);
      setIsRecording(true);
      setTranscription('');
      setErrorMsg('');

      mediaRecorder.onstop = () => {
        const duration = Date.now() - startTime;
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (duration < 500) {
          setErrorMsg('AUDIO_DURATION_THRESHOLD_NOT_MET');
          return;
        }
        setAudioBlob(blob);
        processAudio(blob);
      };
    } catch (err) {
      setErrorMsg('MIC_ACCESS_DENIED_BY_PROTOCOL');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (blob) => {
    if (blob.size < 500) {
      setErrorMsg('SIGNAL_RECEPTION_FAILURE');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const base64Audio = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
      });

      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'asr',
          audioContent: base64Audio,
          sourceLanguage: language,
        }),
      });

      if (!response.ok) throw new Error('PROTOCOL_ERROR_40X');

      const data = await response.json();
      setTranscription(data.transcription || data.output?.[0]?.transcription || '');
    } catch (err) {
      setErrorMsg('STREAMS_TIMEOUT: BHASHINI_G_WAY');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (transcription && onTranscription) {
      onTranscription(transcription);
      setTranscription('');
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-5">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="w-96 p-8 bg-void border-2 border-white/10 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.8)] relative group overflow-hidden"
          >
            {/* Tactical Grid Background Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-red/[0.03] rotate-45 -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 px-4 py-2 bg-void border-2 border-white/5 rounded">
                  <Globe className="w-4 h-4 text-red" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-[10px] font-display font-extrabold text-white uppercase tracking-[0.2em] border-none focus:ring-0 cursor-pointer appearance-none italic"
                  >
                    {BHASHINI_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-void text-white">
                        {lang.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red/10 border-2 border-transparent hover:border-red transition-all rounded group"
                >
                  <X className="w-5 h-5 text-text-tertiary group-hover:text-red" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  {isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-red/20 rounded-full blur-xl -z-10"
                    />
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded flex items-center justify-center transition-all border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                      isRecording
                        ? 'bg-red border-red-light/40 animate-pulse'
                        : 'bg-void border-white/10 hover:border-red/40 group/rec'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-10 h-10 text-white fill-current" />
                    ) : (
                      <Mic className="w-10 h-10 text-white group-hover/rec:text-red transition-colors" />
                    )}
                  </button>
                </div>

                <div className="w-full min-h-[140px] p-6 bg-void border-2 border-white/5 relative group/trans">
                  <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Zap className="w-3 h-3 text-red" />
                  </div>
                  
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-red" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-red italic">
                          D_CRYPTING_SIGNAL
                        </span>
                      </div>
                    ) : errorMsg ? (
                      <p className="text-[11px] text-red font-extrabold uppercase tracking-widest leading-relaxed italic animate-pulse">
                        !! {errorMsg} !!
                      </p>
                    ) : transcription ? (
                      <p className="text-sm text-white leading-relaxed font-mono font-bold italic uppercase tracking-tight">
                        "{transcription}"
                      </p>
                    ) : (
                      <p className="text-[10px] text-text-tertiary font-extrabold uppercase tracking-[0.4em] italic opacity-60">
                        {isRecording
                          ? 'ACTIVE_STREAM_LISTENING...'
                          : `INITIATE_RECORD_PROTOCOL[${BHASHINI_LANGUAGES.find((l) => l.code === language)?.name.toUpperCase()}]`}
                      </p>
                    )}
                  </div>
                </div>

                {(transcription || errorMsg) && !isProcessing && (
                  <div className="flex w-full gap-4">
                    {transcription && (
                      <button
                        onClick={handleConfirm}
                        className="flex-1 py-4 bg-red hover:bg-red-dark text-white font-extrabold rounded border-2 border-red-light/20 flex items-center justify-center gap-3 transition-all shadow-[8px_8px_0px_0px_rgba(159,18,57,0.4)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] uppercase text-[11px] tracking-[0.3em] italic"
                      >
                        <Send className="w-4 h-4" />
                        <span>PROCESS</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setTranscription('');
                        setErrorMsg('');
                      }}
                      className="px-6 py-4 bg-void border-2 border-white/10 text-text-tertiary hover:text-white hover:border-white/30 transition-all font-extrabold uppercase text-[10px] tracking-widest italic"
                    >
                      FLUSH
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(0,0,0,0.8)] transition-all relative overflow-hidden group border-2 ${
          isOpen
            ? 'bg-void border-red text-red'
            : 'bg-red border-red-light/30 text-white'
        }`}
      >
        <div className="absolute inset-0 bg-void/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="w-9 h-9 relative z-10" />
        ) : (
          <Mic className="w-9 h-9 relative z-10" />
        )}
      </motion.button>
    </div>
  );
}
