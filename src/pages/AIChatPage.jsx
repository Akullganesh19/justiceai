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
    <div className="min-h-screen bg-void flex flex-col font-mono text-slate-200">
      
      {/* Statutory Header */}
      <header className="w-full px-8 py-6 border-b border-white/5 bg-void/80 backdrop-blur-md sticky top-0 flex items-center justify-between z-10 shadow-luxe">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 rounded-sm hover:bg-white/5 text-text-tertiary hover:text-gold transition-all border border-transparent hover:border-gold/20 shadow-hard"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-void border-2 border-gold/40 flex items-center justify-center shadow-luxe">
              <Scale className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-xl font-display font-extrabold tracking-widest text-white uppercase italic">JUSTICE_AI</h1>
              <div className="flex items-center gap-1.5 text-[10px] text-gold font-extrabold uppercase tracking-widest opacity-60">
                <Cpu className="w-3.5 h-3.5" />
                <span>STATUTORY_SUBSYSTEM_V4.0</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 rounded-sm bg-void border-2 border-gold/20 text-gold shadow-luxe text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 italic">
            <ShieldCheck className="w-4 h-4" /> SECURE_HANDSHAKE
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
                <div className={`max-w-[85%] md:max-w-[75%] rounded-sm px-5 py-4 border-2 shadow-hard ${isUser ? 'bg-gold text-midnight border-gold-light/20' : 'bg-void border-white/5 text-text-tertiary shadow-inner italic font-mono'}`}>
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
                    <div className="mt-4 flex items-center gap-2 text-[9px] text-gold font-extrabold uppercase tracking-[0.3em] opacity-40">
                      <Sparkles className="w-3 h-3" />
                      INSTITUTIONAL_RESPONSE_LOCAL
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-void border-2 border-white/5 rounded-sm px-5 py-4 shadow-hard flex gap-1.5 items-center">
               <div className="w-2 h-2 rounded-sm bg-white/10 animate-bounce shadow-hard" />
               <div className="w-2 h-2 rounded-sm bg-gold/40 animate-bounce shadow-hard" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 rounded-sm bg-gold animate-bounce shadow-hard" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Input Area */}
      <footer className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-void/90 backdrop-blur-md sticky bottom-0 border-t border-white/5">
        <div className="relative flex items-center bg-void rounded-sm border-2 border-white/5 shadow-hard transition-all focus-within:shadow-luxe focus-within:border-gold/40">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="ENTER_STATUTORY_QUERY_HERE..."
            className="w-full bg-transparent px-8 py-5 outline-none text-text-primary placeholder:text-white/10 text-[14px] font-mono italic"
          />
          <button 
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-3 p-3 rounded-sm bg-gold text-midnight disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gold-light transition-all shadow-hard active:translate-y-[2px]"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[9px] text-text-tertiary mt-4 font-extrabold uppercase tracking-[0.4em] opacity-30 italic">
          INTELLIGENCE_RUNS_LOCALLY. TRANSACTION_SECURED. NOT_FORMAL_COUNSEL.
        </p>
      </footer>

    </div>
  );
}
