import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, ShieldCheck, Scale, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TypewriterEffect({ text, speed = 8, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span>{displayedText}</span>;
}

export default function AIChatPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('justice_ai_simple_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to JusticeAI. Powered by Openclaw (gemma3:4b), functioning securely on your local environment to ensure total data confidentiality. 

How may I assist you with your legal matters today?`,
        timestamp: new Date().toISOString(),
        isTyping: false,
      },
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('justice_ai_simple_chat', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (text) => {
    const rawText = text.trim();
    if (!rawText) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: rawText,
      timestamp: new Date().toISOString(),
    };

    setInputValue('');
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.role !== 'system')
            .map((m) => ({ role: m.role, content: m.content })),
          personality: 'neutral',
          mode: 'copilot',
          jurisdiction: 'National',
          basePrompt: `You are JusticeAI's Legal Copilot. Be highly articulate, exceptionally professional, and precise. Your responses should reflect a high-end, premium legal consulting service. Always format cleanly. You have access to local constitutional resources via Openclaw.`,
          provider: localStorage.getItem('justice_ai_provider') || 'ollama',
          apiKeys: JSON.parse(localStorage.getItem('justice_ai_keys') || '{}'),
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const responseText = data.message?.content || 'No response received.';

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
        isTyping: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: Unable to connect to the JusticeAI local intelligence relay. Please ensure the Openclaw backend is active.`,
        timestamp: new Date().toISOString(),
        isTyping: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypingComplete = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isTyping: false } : m))
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex flex-col font-sans text-slate-200">
      
      {/* Deep Ocean Header */}
      <header className="w-full px-8 py-5 border-b border-[#1b2936] bg-[#0a0b0d]/80 backdrop-blur-md sticky top-0 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full hover:bg-[#1b2936] text-[#9abfd4] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0e72a8] to-[#103b5a] flex items-center justify-center shadow-[0_0_15px_rgba(14,114,168,0.3)]">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#9abfd4]">JusticeAI</h1>
              <div className="flex items-center gap-1.5 text-xs text-[#0e72a8] font-medium opacity-90">
                <Cpu className="w-3 h-3" />
                <span>Openclaw Subsystem</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-[#1b2936] text-[#9abfd4] border border-[#103b5a] shadow-inner text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0e72a8]" /> Secure
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {messages.map((message) => {
            const isUser = message.role === 'user';
            
            return (
              <motion.div 
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${isUser ? 'bg-gradient-to-br from-[#103b5a] to-[#0e72a8] border border-[#1b2936] text-white rounded-br-none' : 'bg-[#121f29] border border-[#103b5a]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-[#9abfd4] rounded-bl-none'}`}>
                  <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                    {!isUser && message.isTyping ? (
                      <TypewriterEffect 
                        text={message.content} 
                        speed={8}
                        onComplete={() => handleTypingComplete(message.id)}
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                  
                  {!isUser && (
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-[#1e4a6a] font-medium uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#0e72a8]" />
                      Response by Local AI
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-[#121f29] border border-[#103b5a]/50 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex gap-1.5 items-center">
               <div className="w-2 h-2 rounded-full bg-[#1e4a6a] animate-bounce" />
               <div className="w-2 h-2 rounded-full bg-[#0e72a8] animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 rounded-full bg-[#9abfd4] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Input Area */}
      <footer className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-[#0a0b0d]/90 backdrop-blur-md sticky bottom-0 border-t border-[#1b2936]">
        <div className="relative flex items-center bg-[#111a22] rounded-full shadow-lg border border-[#103b5a] transition-all focus-within:shadow-[0_0_20px_rgba(14,114,168,0.2)] focus-within:border-[#0e72a8]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Type your legal query here..."
            className="w-full bg-transparent px-6 py-4 outline-none text-[#9abfd4] placeholder:text-[#103b5a] text-[15px]"
          />
          <button 
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 p-2.5 rounded-full bg-gradient-to-r from-[#103b5a] to-[#0e72a8] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(14,114,168,0.6)] hover:brightness-125 transition-all"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[11px] text-[#1e4a6a] mt-3 font-medium tracking-wide">
          Intelligence runs locally. Information is not formal legal advice.
        </p>
      </footer>

    </div>
  );
}
