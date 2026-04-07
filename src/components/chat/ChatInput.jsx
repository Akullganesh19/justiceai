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
      <div className="absolute inset-0 bg-blue/5 blur-[100px] pointer-events-none opacity-10" />
      <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto z-10">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
        />
        <div className="relative flex items-end gap-4 p-3 bg-void border-2 border-white/10 rounded-xl focus-within:border-red/40 transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,0.8)] focus-within:shadow-[12px_12px_0px_0px_rgba(225,29,72,0.05)]">
          <button
            type="button"
            onClick={handleFileClick}
            disabled={isLoading}
            className="p-4 text-text-tertiary hover:text-blue transition-all active:scale-90 disabled:opacity-20 hover:bg-blue/5 rounded-lg border-2 border-transparent hover:border-blue/20"
            title="Attach Evidence Log"
          >
            <Paperclip className="w-6 h-6" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="INPUT LEGAL DESC..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-text-tertiary font-display font-bold uppercase tracking-widest italic resize-none py-4 text-[14px] max-h-[200px]"
          />

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`p-4 rounded transition-all flex items-center justify-center flex-shrink-0 ${
              !text.trim() || isLoading
                ? 'bg-void/5 text-text-tertiary cursor-not-allowed border-2 border-white/5 shadow-none'
                : 'bg-red text-white hover:bg-red-dark active:translate-x-[1px] active:translate-y-[1px] shadow-[6px_6px_0px_0px_rgba(159,18,57,1)] border-2 border-red-light/20'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between px-2">
          <p className="text-[9px] text-text-tertiary uppercase tracking-[0.3em] font-extrabold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
            Core Engine Active
          </p>
          <p className="text-[9px] text-text-tertiary uppercase tracking-[0.3em] font-extrabold">
            [ENTER] to Commit Sequence
          </p>
        </div>
      </form>
    </div>
  );
}
