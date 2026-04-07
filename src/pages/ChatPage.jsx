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
import { Milestone, Sword, ShieldCheck, MapPin } from 'lucide-react';
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
        'Initialization Complete. I am your **JusticeAI Legal Co-pilot**. Describe your legal situation in detail. Our RAG-Engine will build a tactical defense strategy for you.',
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

  // (History is now loaded synchronously via lazy initialization)

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
          content: `Launching **${location.state.caseType}** Demo. I am ready to analyze this situation.`,
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

    // Only if a case is active and has messages (not immediately on a fresh load)
    if (messages.length > 1) {
      const sysMsg = {
        id: Date.now().toString(),
        role: 'system',
        content: `Settings Updated: ${mode.toUpperCase()} Mode • ${judgePersonality} Judge • ${selectedJurisdiction} Jurisdiction`,
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
        content: 'System Reset. I am ready for your next case. How can I help you today?',
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
    console.log('File received for scanning:', file.name);
    setIsScanning(true);
    // Simulation: the overlay will call onComplete after 3.5s
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    const sysMsg = {
      id: Date.now().toString(),
      role: 'system',
      content:
        '📎 **Document Analyzed:** Legal evidence matrix has been updated. I have extracted key clauses and am merging them into your strategy.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, sysMsg]);

    // Auto-trigger analysis update
    handleSend('Please analyze the document I just uploaded and update the strategy.');
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
    <div className="h-screen flex flex-col bg-void overflow-hidden">
      <Header onNewCase={handleNewCase} />

      <main className="flex-1 flex pt-16 h-[calc(100vh-64px)] relative">
        {/* Document Scanning Simulation Overlay */}
        <DocumentScanningOverlay isOpen={isScanning} onComplete={handleScanComplete} />

        {/* Left: Case History Sidebar */}
        <CaseHistorySidebar
          history={history}
          currentCaseId={activeCaseId}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onSelect={loadCase}
          onNew={handleNewCase}
          onDelete={deleteCase}
        />

        {/* Center: Main Workflow Controls */}
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left: Chat Panel Side */}
          <div className="flex-1 flex flex-col border-r border-white/5 order-2 md:order-1 h-full min-w-0">
            {/* Mode & Personality Controls */}
            <div className="p-3 border-b border-white/5 bg-raised/30 flex flex-col gap-3">
              {/* Hard Legal Disclaimer */}
              {/* Hard Legal Disclaimer */}
              <div className="w-full bg-red/10 border-2 border-red/20 p-2 rounded shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)]">
                <p className="text-[10px] text-white font-extrabold uppercase tracking-widest text-center">
                  ⚠️ <span className="text-red">OPERATIONAL OVERVIEW:</span> INFORMATION AS-IS. NO
                  ADVOCATE-CLIENT PRIVILEGE IS IMPLIED.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex bg-void p-1 rounded border-2 border-white/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                  <button
                    onClick={() => setMode('copilot')}
                    className={`flex items-center gap-2 px-5 py-2 rounded text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all ${mode === 'copilot' ? 'bg-red text-white shadow-[2px_2px_0px_0px_rgba(159,18,57,1)]' : 'text-text-tertiary hover:text-white'}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Directive</span>
                  </button>
                  <div className="relative group">
                    <button
                      onClick={() => setMode('simulator')}
                      className={`flex items-center gap-2 px-5 py-2 rounded text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all ${mode === 'simulator' ? 'bg-blue text-white shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]' : 'text-text-tertiary hover:text-white'}`}
                    >
                      <Sword className="w-3.5 h-3.5" />
                      <span>Simulator</span>
                    </button>
                    <div className="absolute top-full left-0 mt-3 w-56 p-4 bg-void border-2 border-white/10 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                      <p className="text-[9px] text-text-tertiary uppercase tracking-[0.2em] leading-relaxed font-extrabold italic">
                        Moot Simulation Active. Legal reality may diverge.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Milestone className="w-4 h-4 text-red opacity-50" />
                  <select
                    value={judgePersonality}
                    onChange={(e) => setJudgePersonality(e.target.value)}
                    className="bg-void border-2 border-white/10 rounded px-4 py-2 text-[10px] font-extrabold text-white uppercase tracking-[0.2em] focus:outline-none focus:border-red/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] appearance-none cursor-pointer"
                  >
                    <option value="Strict">Strict Judge</option>
                    <option value="Neutral">Neutral Judge</option>
                    <option value="Lenient">Lenient Judge</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue opacity-50" />
                  <select
                    value={selectedJurisdiction}
                    onChange={(e) => setSelectedJurisdiction(e.target.value)}
                    className="bg-void border-2 border-white/10 rounded px-4 py-2 text-[10px] font-extrabold text-white uppercase tracking-[0.2em] focus:outline-none focus:border-blue/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] appearance-none cursor-pointer"
                  >
                    <option value="National">National Domain</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
              </div>
            </div>

            <ChatPanel messages={messages} isLoading={isLoading} />
            <ChatInput onSend={handleSend} onUpload={handleFileUpload} isLoading={isLoading} />
          </div>

          {/* Right: Analysis Side */}
          <div className="w-full md:w-[420px] lg:w-[480px] bg-void overflow-hidden order-1 md:order-2 h-full border-b md:border-b-0 border-white/5 shadow-[-8px_0px_30px_0px_rgba(0,0,0,0.5)]">
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
