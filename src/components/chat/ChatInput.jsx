import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';

export default function ChatInput({ onSend, onUpload, isLoading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileClick = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  useEffect(() => {
    const handleTranscription = (e) => {
      if (e.detail?.text) {
        setText((prev) => (prev ? `${prev} ${e.detail.text}` : e.detail.text));
      }
    };

    window.addEventListener('justice-ai-transcription', handleTranscription);
    return () => window.removeEventListener('justice-ai-transcription', handleTranscription);
  }, []);

  return (
    <div className="p-6 md:p-8 border-t-2 border-white/5 bg-void relative">
      <div className="absolute inset-0 bg-gold/5 blur-[100px] pointer-events-none opacity-5" />
      <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto z-10">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
        />
        <div className="relative flex items-end gap-4 p-3 bg-void border-2 border-white/10 rounded-sm focus-within:border-gold/40 transition-all shadow-hard">
          <button
            type="button"
            onClick={handleFileClick}
            disabled={isLoading}
            className="p-4 text-text-tertiary hover:text-gold transition-all active:scale-95 disabled:opacity-20 hover:bg-gold/5 rounded-sm border-2 border-transparent hover:border-gold/20 shadow-hard"
            title="Attach Document"
          >
            <Paperclip className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question or describe your case..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-text-tertiary/40 font-body font-medium italic resize-none py-4 text-[15px] max-h-[200px] uppercase tracking-wide"
          />

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`p-4 rounded-sm transition-all flex items-center justify-center flex-shrink-0 border-2 ${
              !text.trim() || isLoading
                ? 'bg-white/5 text-text-tertiary cursor-not-allowed border-white/5'
                : 'bg-gold text-midnight hover:bg-gold-light active:translate-y-[2px] shadow-hard border-gold-light/20'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between px-4 gap-2">
          <p className="text-[10px] text-text-tertiary uppercase tracking-[0.4em] font-extrabold flex items-center gap-2 italic">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            STATUTORY_INTELLIGENCE_ACTIVE
          </p>
          <p className="text-[10px] text-text-tertiary/60 uppercase tracking-[0.3em] font-extrabold italic">
            PRESS_ENTER_FOR_PROCEDURAL_DISPATCH
          </p>
        </div>
      </form>
    </div>
  );
}
