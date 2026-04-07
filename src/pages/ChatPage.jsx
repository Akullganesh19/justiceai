import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/ui/Header';
import ChatPanel from '../components/chat/ChatPanel';
import ChatInput from '../components/chat/ChatInput';
import AnalysisPanel from '../components/analysis/AnalysisPanel';
import ExportModal from '../components/ui/ExportModal';
import { CaseHistorySidebar } from '../components/chat/CaseHistorySidebar';
import { sendMessage } from '../lib/claudeApi';
import { parseAIResponse } from '../lib/parseAnalysis';
import { generateSummary } from '../lib/generateSummary';
import { Milestone, Sword, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import DocumentScanningOverlay from '../components/chat/DocumentScanningOverlay';

export default function ChatPage() {
  const location = useLocation();
  const [activeCaseId, setActiveCaseId] = useState(Date.now().toString());
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('justice_ai_history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      return [];
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Case State
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content:
        'SYSTEM_INITIALIZED. I am your JUSTICE_AI_STATUTORY_ANALYST. Please describe the procedural parameters of your case. Our engine will formulate a validated statutory strategy.',
      timestamp: new Date(),
    },
  ]);
  const [analysis, setAnalysis] = useState(null);

  // Settings State
  const [mode, setMode] = useState('copilot'); // 'copilot' | 'simulator'
  const [judgePersonality, setJudgePersonality] = useState('Neutral'); // 'Strict' | 'Neutral' | 'Lenient'
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('National');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [summary, setSummary] = useState('');

  // Calculate Progress
  const progress = analysis ? 100 : Math.min(Math.floor((messages.length - 1) * 25), 80);

  // 2. Handle Samples from Router State
  useEffect(() => {
    if (location.state?.sampleCase) {
      // Start new case with sample content
      const newId = Date.now().toString();
      setActiveCaseId(newId);
      const initialMsgs = [
        {
          id: '1',
          role: 'assistant',
          content: `Initializing **${location.state.caseType}** analysis. I am reviewing the provided scenario.`,
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'user',
          content: location.state.sampleCase,
          timestamp: new Date(),
        },
      ];
      setMessages(initialMsgs);
      setAnalysis(null);

      // Auto-trigger analysis for sample
      handleSampleTrigger(initialMsgs, location.state.sampleCase);
    }
  }, [location.state]);

  // 3. Save History to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('justice_ai_history', JSON.stringify(history));
  }, [history]);

  // 4. Handle System Setting Change Notification
  const initialMount = React.useRef(true);
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    // Only if a case is active and has messages
    if (messages.length > 1) {
      const sysMsg = {
        id: Date.now().toString(),
        role: 'system',
        content: `Configuration Updated: ${mode === 'copilot' ? 'Assistance' : 'Moot Court'} Mode • ${judgePersonality} Stance • ${selectedJurisdiction} Jurisdiction`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sysMsg]);
    }
  }, [mode, judgePersonality, selectedJurisdiction]);

  // Case Management Handlers
  const saveCurrentToHistory = () => {
    const title = messages[1]?.content?.substring(0, 40) + '...' || 'Untitled Case';
    const caseData = {
      id: activeCaseId,
      title,
      messages,
      analysis,
      timestamp: new Date(),
    };

    setHistory((prev) => {
      const filtered = prev.filter((c) => c.id !== activeCaseId);
      return [caseData, ...filtered];
    });
  };

  const loadCase = (id) => {
    const caseData = history.find((c) => c.id === id);
    if (caseData) {
      setActiveCaseId(id);
      setMessages(caseData.messages);
      setAnalysis(caseData.analysis);
    }
  };

  const handleNewCase = () => {
    // Save current before resetting if it has content
    if (messages.length > 1) {
      saveCurrentToHistory();
    }

    const newId = Date.now().toString();
    setActiveCaseId(newId);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'System reset. I am ready to assist with your next consultation. How may I help you?',
        timestamp: new Date(),
      },
    ]);
    setAnalysis(null);
  };

  const deleteCase = (id) => {
    setHistory((prev) => prev.filter((c) => c.id !== id));
    if (activeCaseId === id) {
      handleNewCase();
    }
  };

  const handleFileUpload = (file) => {
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    const sysMsg = {
      id: Date.now().toString(),
      role: 'system',
      content:
        '📎 **Document Processed:** Information from your uploaded document has been integrated into the case intelligence folder.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, sysMsg]);

    // Auto-trigger analysis update
    handleSend('Analyze the recently integrated document and update the strategy accordingly.');
  };

  // Helper for sample trigger
  const handleSampleTrigger = async (currentMsgs, content) => {
    setIsLoading(true);
    try {
      const aiResponseRaw = await sendMessage(currentMsgs, content, {
        judgePersonality,
        mode,
        jurisdiction: selectedJurisdiction,
      });
      const { chatMessage, analysis: newAnalysis } = parseAIResponse(aiResponseRaw);
      const aiMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: chatMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (newAnalysis) setAnalysis(newAnalysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (content) => {
    const userMsg = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const aiResponseRaw = await sendMessage(updatedMessages, content, {
        judgePersonality,
        mode,
        jurisdiction: selectedJurisdiction,
      });
      const { chatMessage, analysis: newAnalysis } = parseAIResponse(aiResponseRaw);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chatMessage,
        timestamp: new Date(),
      };

      const finaleMsgs = [...updatedMessages, aiMsg];
      setMessages(finaleMsgs);

      if (newAnalysis) {
        setAnalysis(newAnalysis);
      }

      // Auto-save to history
      const title = updatedMessages[1]?.content?.substring(0, 40) + '...' || 'Untitled Case';
      const caseData = {
        id: activeCaseId,
        title,
        messages: finaleMsgs,
        analysis: newAnalysis || analysis,
        timestamp: new Date(),
      };

      setHistory((prev) => {
        const filtered = prev.filter((c) => c.id !== activeCaseId);
        return [caseData, ...filtered];
      });
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `**Error:** ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const textSummary = generateSummary(messages, analysis);
    setSummary(textSummary);
    setIsExportOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-void overflow-hidden font-mono text-slate-200">
      <Header onNewCase={handleNewCase} />

      <main className="flex-1 flex pt-16 h-[calc(100vh-64px)] relative">
        <DocumentScanningOverlay isOpen={isScanning} onComplete={handleScanComplete} />

        <CaseHistorySidebar
          history={history}
          currentCaseId={activeCaseId}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onSelect={loadCase}
          onNew={handleNewCase}
          onDelete={deleteCase}
        />

        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {/* Chat Side */}
          <div className="flex-1 flex flex-col border-r border-white/5 order-2 md:order-1 h-full min-w-0">
            <div className="p-4 border-b border-white/5 bg-midnight-slate/50 flex flex-col gap-4">
              <div className="w-full bg-void border-2 border-gold/40 p-3 rounded-sm shadow-luxe flex items-center justify-center gap-3 italic">
                <AlertCircle className="w-4 h-4 text-gold" />
                <p className="text-[10px] text-gold font-extrabold uppercase tracking-[0.3em] text-center">
                  INSTITUTIONAL_NOTICE: CONSULTATIONS_ARE_INFORMATIONAL. NO_ADVOCATE_CLIENT_PRIVILEGE.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex bg-void p-1 rounded-sm border-2 border-white/5 shadow-hard">
                  <button
                    onClick={() => setMode('copilot')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all italic ${mode === 'copilot' ? 'bg-gold text-midnight shadow-luxe' : 'text-text-tertiary hover:text-white'}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ASSISTANCE</span>
                  </button>
                  <div className="relative group">
                    <button
                      onClick={() => setMode('simulator')}
                      className={`flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all italic ${mode === 'simulator' ? 'bg-blue-600 text-white shadow-luxe' : 'text-text-tertiary hover:text-white'}`}
                    >
                      <Sword className="w-3.5 h-3.5" />
                      <span>SIMULATION</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="hidden lg:flex items-center gap-3">
                    <Milestone className="w-3.5 h-3.5 text-gold opacity-50" />
                    <select
                      value={judgePersonality}
                      onChange={(e) => setJudgePersonality(e.target.value)}
                      className="bg-void border-2 border-white/5 rounded-sm px-4 py-2 text-[10px] font-extrabold text-gold uppercase tracking-widest focus:outline-none focus:border-gold/50 shadow-luxe appearance-none cursor-pointer italic"
                    >
                      <option value="Strict">STRICT_BENCH</option>
                      <option value="Neutral">NEUTRAL_BENCH</option>
                      <option value="Lenient">LENIENT_BENCH</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 opacity-50" />
                    <select
                      value={selectedJurisdiction}
                      onChange={(e) => setSelectedJurisdiction(e.target.value)}
                      className="bg-void border-2 border-white/5 rounded-sm px-4 py-2 text-[10px] font-extrabold text-white uppercase tracking-widest focus:outline-none focus:border-gold/50 shadow-luxe appearance-none cursor-pointer italic"
                    >
                      <option value="National">NATIONAL</option>
                      <option value="Maharashtra">MAHARASHTRA</option>
                      <option value="Delhi">DELHI</option>
                      <option value="Karnataka">KARNATAKA</option>
                      <option value="Tamil Nadu">TAMIL_NADU</option>
                      <option value="West Bengal">WEST_BENGAL</option>
                      <option value="Uttar Pradesh">UTTAR_PRADESH</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <ChatPanel messages={messages} isLoading={isLoading} />
            <ChatInput onSend={handleSend} onUpload={handleFileUpload} isLoading={isLoading} />
          </div>

          {/* Analysis Side */}
          <div className="w-full md:w-[420px] lg:w-[480px] bg-midnight overflow-hidden order-1 md:order-2 h-full border-b md:border-b-0 border-white/5 shadow-premium">
            <AnalysisPanel
              analysis={analysis}
              selectedJurisdiction={selectedJurisdiction}
              isLoading={isLoading}
              onExport={handleExport}
              progress={progress}
            />
          </div>
        </div>
      </main>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} summary={summary} />
    </div>
  );
}
