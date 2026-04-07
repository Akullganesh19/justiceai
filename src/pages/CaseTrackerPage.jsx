import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Edit3,
  Save,
  X,
  AlertTriangle,
  Milestone,
  FileText,
  Phone,
  Mail,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Timer,
  Users,
  Building,
} from 'lucide-react';
import { useToast } from '../components/ui/Toast.jsx';
import Header from '../components/ui/Header.jsx';
import Footer from '../components/ui/Footer.jsx';

// Case type specific milestone templates
const CASE_TEMPLATES = {
  consumer: {
    name: 'Consumer Complaint',
    description: 'File a complaint under Consumer Protection Act, 2019',
    steps: [
      {
        id: 1,
        label: 'Gather Evidence & Documents',
        description: 'Collect bills, receipts, correspondence, product photos',
        completed: false,
      },
      {
        id: 2,
        label: 'Send Legal Notice',
        description: 'Send notice to opposite party under Section 72 of CPA 2019',
        completed: false,
        expectedDays: 30,
      },
      {
        id: 3,
        label: 'Draft Consumer Complaint',
        description: 'Prepare complaint with facts, relief sought, and documents',
        completed: false,
      },
      {
        id: 4,
        label: 'File at Consumer Commission',
        description: 'File at District/State/National Commission based on value',
        completed: false,
      },
      {
        id: 5,
        label: 'Pay Court Fee',
        description: 'Pay nominal fee (Rs. 100-500 depending on value)',
        completed: false,
      },
      {
        id: 6,
        label: 'First Hearing - Admission',
        description: 'Court examines if complaint is admissible',
        completed: false,
      },
      {
        id: 7,
        label: 'Notice to Opposite Party',
        description: 'Court issues notice to opposite party',
        completed: false,
      },
      {
        id: 8,
        label: 'Evidence & Arguments',
        description: 'Submit evidence and present arguments',
        completed: false,
      },
      {
        id: 9,
        label: 'Final Order',
        description: 'Receive compensation/refund order',
        completed: false,
      },
    ],
  },
  criminal: {
    name: 'Criminal Case',
    description: 'Track criminal proceedings under BNS/BNSS',
    steps: [
      {
        id: 1,
        label: 'FIR Registration',
        description: 'File FIR at police station or online',
        completed: false,
      },
      {
        id: 2,
        label: 'Police Investigation',
        description: 'Police investigate and collect evidence',
        completed: false,
      },
      {
        id: 3,
        label: 'Chargesheet Filing',
        description: 'Police file chargesheet under Section 173 CrPC',
        completed: false,
      },
      {
        id: 4,
        label: 'First Production / Remand',
        description: 'Accused produced before magistrate',
        completed: false,
      },
      {
        id: 5,
        label: 'Bail Hearing',
        description: 'Apply for regular/anticipatory bail',
        completed: false,
      },
      {
        id: 6,
        label: 'Framing of Charges',
        description: 'Court frames charges under relevant sections',
        completed: false,
      },
      {
        id: 7,
        label: 'Prosecution Evidence',
        description: 'Prosecution presents witnesses and evidence',
        completed: false,
      },
      {
        id: 8,
        label: 'Cross-Examination',
        description: 'Cross-examine prosecution witnesses',
        completed: false,
      },
      {
        id: 9,
        label: 'Defense Evidence',
        description: 'Present defense case and witnesses',
        completed: false,
      },
      {
        id: 10,
        label: 'Final Arguments',
        description: 'Both sides present final arguments',
        completed: false,
      },
      { id: 11, label: 'Judgment', description: 'Court pronounces verdict', completed: false },
      {
        id: 12,
        label: 'Sentencing / Appeal',
        description: 'If convicted, sentencing or file appeal',
        completed: false,
      },
    ],
  },
  civil: {
    name: 'Civil Suit',
    description: 'Track civil litigation proceedings',
    steps: [
      {
        id: 1,
        label: 'Draft Plaint',
        description: 'Prepare plaint with cause of action and relief',
        completed: false,
      },
      {
        id: 2,
        label: 'File Suit',
        description: 'File suit at appropriate civil court',
        completed: false,
      },
      {
        id: 3,
        label: 'Pay Court Fee',
        description: 'Pay ad valorem court fee on relief value',
        completed: false,
      },
      {
        id: 4,
        label: 'Admission / Summons',
        description: 'Court admits suit and issues summons',
        completed: false,
      },
      {
        id: 5,
        label: 'Service of Summons',
        description: 'Ensure summons served to defendant',
        completed: false,
      },
      {
        id: 6,
        label: 'Written Statement',
        description: 'Defendant files written statement',
        completed: false,
      },
      {
        id: 7,
        label: 'Framing of Issues',
        description: 'Court frames issues for trial',
        completed: false,
      },
      {
        id: 8,
        label: 'Plaintiff Evidence',
        description: 'Plaintiff presents evidence (PW & documents)',
        completed: false,
      },
      {
        id: 9,
        label: 'Defendant Evidence',
        description: 'Defendant presents evidence',
        completed: false,
      },
      {
        id: 10,
        label: 'Final Arguments',
        description: 'Both sides argue on framed issues',
        completed: false,
      },
      { id: 11, label: 'Judgment', description: 'Court pronounces judgment', completed: false },
      {
        id: 12,
        label: 'Execution / Appeal',
        description: 'Execute decree or file appeal',
        completed: false,
      },
    ],
  },
  rera: {
    name: 'RERA Complaint',
    description: 'Real Estate Regulatory Authority complaint',
    steps: [
      {
        id: 1,
        label: 'Gather Documents',
        description: 'Collect agreement, payment receipts, RERA registration details',
        completed: false,
      },
      {
        id: 2,
        label: 'Send Notice to Builder',
        description: 'Send legal notice for deficiency/delay',
        completed: false,
        expectedDays: 30,
      },
      {
        id: 3,
        label: 'File RERA Complaint',
        description: 'File complaint at State RERA Authority',
        completed: false,
      },
      { id: 4, label: 'Pay Filing Fee', description: 'Pay Rs. 5,000 filing fee', completed: false },
      {
        id: 5,
        label: 'First Hearing',
        description: 'RERA Authority lists for hearing',
        completed: false,
      },
      {
        id: 6,
        label: 'Builder Response',
        description: 'Builder files reply/objections',
        completed: false,
      },
      {
        id: 7,
        label: 'Hearings & Evidence',
        description: 'Present evidence and arguments',
        completed: false,
      },
      {
        id: 8,
        label: 'RERA Order',
        description: 'Receive order for refund/compensation',
        completed: false,
      },
    ],
  },
  chequebounce: {
    name: 'Cheque Bounce (138 NI)',
    description: 'Negotiable Instruments Act Section 138 case',
    steps: [
      {
        id: 1,
        label: 'Cheque Returned',
        description: 'Bank returns cheque with memo',
        completed: false,
      },
      {
        id: 2,
        label: 'Send Legal Notice',
        description: 'Send notice within 30 days of return',
        completed: false,
        expectedDays: 30,
      },
      {
        id: 3,
        label: 'Wait for Payment',
        description: 'Allow 15 days for payment after notice',
        completed: false,
        expectedDays: 15,
      },
      {
        id: 4,
        label: 'File Complaint',
        description: 'File complaint under Section 138 NI Act',
        completed: false,
      },
      {
        id: 5,
        label: 'Process Summons',
        description: 'Court issues summons to accused',
        completed: false,
      },
      {
        id: 6,
        label: 'Appearance of Accused',
        description: 'Accused appears and files reply',
        completed: false,
      },
      {
        id: 7,
        label: 'Evidence',
        description: 'Present bank memo, notice, and proof of service',
        completed: false,
      },
      { id: 8, label: 'Final Arguments', description: 'Argue for conviction', completed: false },
      { id: 9, label: 'Judgment', description: 'Court pronounces verdict', completed: false },
      {
        id: 10,
        label: 'Compensation / Appeal',
        description: 'Receive compensation or file appeal',
        completed: false,
      },
    ],
  },
  family: {
    name: 'Family Dispute',
    description: 'Divorce, maintenance, custody matters',
    steps: [
      {
        id: 1,
        label: 'Consultation & Strategy',
        description: 'Discuss grounds, relief sought, and evidence',
        completed: false,
      },
      {
        id: 2,
        label: 'Send Notice / Attempt Mediation',
        description: 'Legal notice or mutual consent approach',
        completed: false,
      },
      {
        id: 3,
        label: 'File Petition',
        description: 'File at Family Court (divorce/maintenance/custody)',
        completed: false,
      },
      {
        id: 4,
        label: 'First Motion',
        description: 'First motion hearing and statements',
        completed: false,
      },
      {
        id: 5,
        label: 'Mediation / Counseling',
        description: 'Court refers to mediation center',
        completed: false,
      },
      {
        id: 6,
        label: 'Evidence (if contested)',
        description: 'Present evidence and witnesses',
        completed: false,
      },
      { id: 7, label: 'Final Arguments', description: 'Present final arguments', completed: false },
      { id: 8, label: 'Decree / Order', description: 'Receive court order', completed: false },
    ],
  },
  custom: {
    name: 'Custom Case',
    description: 'Create your own timeline',
    steps: [
      {
        id: 1,
        label: 'Initial Research',
        description: 'Understand your legal position',
        completed: false,
      },
      {
        id: 2,
        label: 'Gather Documents',
        description: 'Collect all relevant documents',
        completed: false,
      },
      {
        id: 3,
        label: 'Consult Lawyer',
        description: 'Get professional legal advice',
        completed: false,
      },
      { id: 4, label: 'Take Action', description: 'File case or send notice', completed: false },
    ],
  },
};

const CASE_TYPES = Object.entries(CASE_TEMPLATES).map(([id, data]) => ({ id, ...data }));

const STORAGE_KEY = 'justice_ai_case_tracker_v2';

// Calculate days until hearing
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hearingDate = new Date(dateStr);
  hearingDate.setHours(0, 0, 0, 0);
  const diff = hearingDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function StepItem({ step, index, total, onToggle, onDelete, onEdit, onUpdateStep }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(step.label);
  const [editDesc, setEditDesc] = useState(step.description);
  const [showDetails, setShowDetails] = useState(false);

  const handleSave = () => {
    onEdit(step.id, editLabel, editDesc);
    setIsEditing(false);
  };

  const completedBefore = step.completed;
  const isLast = index === total - 1;
  const daysLeft = daysUntil(step.expectedDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.04 }}
      className="flex gap-4"
    >
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onToggle(step.id)}
          className={`w-12 h-12 rounded bg-void border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[1px] active:translate-y-[1px] ${completedBefore ? 'bg-accent-success border-accent-success text-white scale-110' : 'bg-void border-white/10 text-white/20 hover:border-red/50 hover:text-red group-hover:border-red/40'}`}
        >
          {completedBefore ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-current" />
          )}
        </button>
        {!isLast && (
          <div
            className={`w-[2px] flex-1 min-h-[50px] transition-all duration-500 ${completedBefore ? 'bg-accent-success/40 scale-x-110' : 'bg-void/5'}`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <div
          className={`p-6 rounded border-2 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] ${completedBefore ? 'bg-void border-accent-success/40' : 'bg-void border-white/5 hover:border-white/10 group-hover:border-white/20'}`}
        >
          {isEditing ? (
            <div className="space-y-4">
              <input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-full bg-void border-2 border-white/10 rounded px-5 py-3 text-sm text-white focus:outline-none focus:border-red/60 font-display font-bold tracking-widest uppercase italic"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className="w-full bg-void border-2 border-white/10 rounded px-5 py-3 text-sm text-white focus:outline-none focus:border-red/60 font-body italic resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red text-white rounded font-extrabold text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(159,18,57,0.4)] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <Save className="w-3.5 h-3.5" /> COMMIT_SAVE
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-void border-2 border-white/10 text-white/60 rounded font-extrabold text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> ABORT
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-[9px] uppercase font-extrabold tracking-[0.2em] px-3 py-1 rounded border-2 ${completedBefore ? 'bg-accent-success/10 border-accent-success/40 text-accent-success shadow-[4px_4px_0px_0px_rgba(34,197,94,0.1)]' : 'bg-void border-white/10 text-white/30'}`}
                  >
                    PHASE_0{index + 1}
                  </span>
                  {completedBefore && (
                    <span className="text-[9px] text-accent-success font-extrabold uppercase tracking-widest italic animate-pulse">
                      [ EXECUTED ]
                    </span>
                  )}
                  {daysLeft !== null && daysLeft >= 0 && !completedBefore && (
                    <div
                      className={`text-[9px] font-extrabold uppercase tracking-[0.1em] px-3 py-1 rounded border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-2 ${daysLeft <= 3 ? 'bg-red/10 border-red/40 text-red animate-pulse' : daysLeft <= 7 ? 'bg-blue/10 border-blue/40 text-blue' : 'bg-void border-white/20 text-white/60'}`}
                    >
                      <Timer className="w-3 h-3" />
                      {daysLeft === 0
                        ? 'CRITICAL: TODAY'
                        : daysLeft === 1
                          ? 'IMMINENT: T-1 DAY'
                          : `T-MINUS ${daysLeft} DAYS`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-2 rounded hover:bg-void/5 text-text-tertiary hover:text-red transition-all border-2 border-transparent hover:border-white/10"
                  >
                    {showDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded hover:bg-void/5 text-text-tertiary hover:text-red transition-all border-2 border-transparent hover:border-white/10"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(step.id)}
                    className="p-1.5 rounded-lg hover:bg-accent-error/10 text-text-tertiary hover:text-accent-error transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3
                className={`text-lg font-display font-bold uppercase tracking-tight italic ${completedBefore ? 'text-accent-success' : 'text-white'}`}
              >
                {step.label}
              </h3>
              <p className="text-[11px] text-text-tertiary font-body mt-2 leading-relaxed uppercase tracking-wider italic opacity-70">
                {step.description}
              </p>

              {showDetails && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-extrabold tracking-[0.3em] text-white/40 block">
                        PROJECTION_DATE
                      </label>
                      <input
                        type="date"
                        value={step.expectedDate || ''}
                        onChange={(e) => onUpdateStep(step.id, { expectedDate: e.target.value })}
                        className="w-full bg-void border-2 border-white/10 rounded px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-red/40 font-mono tracking-tighter shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-extrabold tracking-[0.3em] text-white/40 block">
                        EXECUTION_DATE
                      </label>
                      <input
                        type="date"
                        value={step.completedDate || ''}
                        onChange={(e) => onUpdateStep(step.id, { completedDate: e.target.value })}
                        className="w-full bg-void border-2 border-white/10 rounded px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-accent-success/40 font-mono tracking-tighter shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-extrabold tracking-[0.3em] text-white/40 block">
                      TACTICAL_NOTES_FIELD
                    </label>
                    <textarea
                      value={step.notes || ''}
                      onChange={(e) => onUpdateStep(step.id, { notes: e.target.value })}
                      placeholder="ENTER_OBSERVATIONS..."
                      rows={2}
                      className="w-full bg-void border-2 border-white/10 rounded px-4 py-2.5 text-[11px] text-white focus:outline-none focus:border-red/40 font-body italic resize-none shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-extrabold tracking-[0.3em] text-white/40 block">
                      CITATION_INDEX_REF
                    </label>
                    <input
                      type="text"
                      value={step.documentRef || ''}
                      onChange={(e) => onUpdateStep(step.id, { documentRef: e.target.value })}
                      placeholder="REFERENCE_ID..."
                      className="w-full bg-void border-2 border-white/10 rounded px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-blue/40 font-display font-bold uppercase tracking-widest italic shadow-inner"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseTrackerPage() {
  const { success, error: showError } = useToast();
  const [cases, setCases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCaseId, setActiveCaseId] = useState(cases[0]?.id);
  const [newStepLabel, setNewStepLabel] = useState('');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState('consumer');
  const [showCNRModal, setShowCNRModal] = useState(false);
  const [cnrNumber, setCnrNumber] = useState('');

  // Case details fields
  const [caseDetails, setCaseDetails] = useState({
    caseNumber: '',
    courtName: '',
    bench: '',
    advocateName: '',
    advocatePhone: '',
    oppositeParty: '',
    nextHearing: '',
  });

  const activeCase = cases.find((c) => c.id === activeCaseId);
  const completedCount = activeCase?.steps.filter((s) => s.completed).length || 0;
  const totalSteps = activeCase?.steps.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Check for upcoming hearings
  useEffect(() => {
    if (!activeCase) return;
    const upcomingHearings = activeCase.steps.filter((s) => {
      const days = daysUntil(s.expectedDate);
      return days !== null && days >= 0 && days <= 3 && !s.completed;
    });
    if (upcomingHearings.length > 0) {
      // Could show a toast or badge
    }
  }, [activeCase]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }, [cases]);

  const updateActiveCase = (updater) => {
    setCases((prev) => prev.map((c) => (c.id === activeCaseId ? updater(c) : c)));
  };

  const toggleStep = (stepId) => {
    updateActiveCase((c) => ({
      ...c,
      steps: c.steps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              completed: !s.completed,
              completedDate: !s.completed ? new Date().toISOString().split('T')[0] : '',
            }
          : s,
      ),
    }));
  };

  const deleteStep = (stepId) => {
    updateActiveCase((c) => ({ ...c, steps: c.steps.filter((s) => s.id !== stepId) }));
  };

  const editStep = (stepId, label, description) => {
    updateActiveCase((c) => ({
      ...c,
      steps: c.steps.map((s) => (s.id === stepId ? { ...s, label, description } : s)),
    }));
  };

  const onUpdateStep = (stepId, updates) => {
    updateActiveCase((c) => ({
      ...c,
      steps: c.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
    }));
  };

  const addStep = () => {
    if (!newStepLabel.trim()) return;
    updateActiveCase((c) => ({
      ...c,
      steps: [
        ...c.steps,
        { id: Date.now(), label: newStepLabel, description: '', completed: false },
      ],
    }));
    setNewStepLabel('');
    success({ title: 'Step Added', message: `"${newStepLabel}" added to timeline` });
  };

  const createNewCase = () => {
    const template = CASE_TEMPLATES[selectedCaseType];
    const newCase = {
      id: Date.now().toString(),
      name: newCaseName || template.name,
      caseType: selectedCaseType,
      steps: JSON.parse(JSON.stringify(template.steps)),
      createdAt: new Date().toISOString(),
      details: {
        caseNumber: '',
        courtName: '',
        bench: '',
        advocateName: '',
        advocatePhone: '',
        oppositeParty: '',
        nextHearing: '',
      },
    };
    setCases((prev) => [...prev, newCase]);
    setActiveCaseId(newCase.id);
    setShowNewCaseModal(false);
    setNewCaseName('');
    success({ title: 'Case Created', message: `${template.name} case created successfully` });
  };

  const deleteCase = (caseId) => {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    if (activeCaseId === caseId) {
      setActiveCaseId(cases.find((c) => c.id !== caseId)?.id);
    }
    showError({ title: 'Case Deleted', message: 'Case has been removed' });
  };

  const updateCaseDetails = (field, value) => {
    setCaseDetails((prev) => ({ ...prev, [field]: value }));
    updateActiveCase((c) => ({ ...c, details: { ...c.details, [field]: value } }));
  };

  const lookupCNR = async () => {
    if (!cnrNumber.trim()) return;
    // Simulate eCourts CNR lookup - in production, integrate with actual API
    try {
      // This would call the actual eCourts API
      // For demo, show a message
      success({
        title: 'CNR Lookup',
        message: `Looking up case: ${cnrNumber}... (eCourts API integration pending)`,
      });
      setShowCNRModal(false);
    } catch (err) {
      showError({ title: 'Lookup Failed', message: err.message });
    }
  };

  const getUpcomingHearings = () => {
    if (!activeCase) return [];
    return activeCase.steps
      .filter((s) => s.expectedDate && !s.completed)
      .map((s) => ({ ...s, daysLeft: daysUntil(s.expectedDate) }))
      .filter((s) => s.daysLeft !== null && s.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const upcomingHearings = getUpcomingHearings();

  return (
    <div className="min-h-screen bg-void pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32 space-y-12 pb-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-red/10 text-red-light text-[10px] uppercase font-extrabold tracking-[0.4em] rounded border-2 border-red/20 shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)] font-display italic">
            <Milestone className="w-4 h-4" />
            <span>Tactical_Deployment_Tracker</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none">
            Legal <span className="text-red italic">Pipeline</span>
          </h1>
          <p className="text-lg text-text-tertiary leading-relaxed max-w-2xl mx-auto font-body uppercase tracking-wider italic">
            Monitor procedural progression, upcoming mandates, and statutory milestones in
            real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-[340px,1fr] gap-12">
          {/* Left sidebar — case list */}
          <div className="space-y-8">
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewCaseModal(true)}
                className="flex-1 flex items-center justify-center gap-3 px-5 py-4 bg-void border-2 border-red/40 rounded text-[11px] font-extrabold text-red uppercase tracking-widest hover:bg-red hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(225,29,72,0.1)] active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Plus className="w-4 h-4" /> INITIALIZE
              </button>
              <button
                onClick={() => setShowCNRModal(true)}
                className="flex items-center justify-center gap-3 px-5 py-4 bg-void border-2 border-blue/40 rounded text-[11px] font-extrabold text-blue uppercase tracking-widest hover:bg-blue hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(37,99,235,0.1)] active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Search className="w-4 h-4" /> SCAN_CNR
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-white/40 block mb-4 px-2 italic border-l-2 border-red/40 pl-4">
                SESSIONS_LOG_V3.1
              </label>
              {cases.length === 0 ? (
                <div className="p-12 text-center bg-void rounded border-2 border-white/5 shadow-inner">
                  <Milestone className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-[10px] text-text-tertiary uppercase font-extrabold tracking-widest italic opacity-40">
                    No session records found. Create primary node to begin.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cases.map((c) => {
                    const done = c.steps.filter((s) => s.completed).length;
                    const pct = c.steps.length > 0 ? Math.round((done / c.steps.length) * 100) : 0;
                    const hasUrgentHearing = c.steps.some((s) => {
                      const days = daysUntil(s.expectedDate);
                      return days !== null && days >= 0 && days <= 3 && !s.completed;
                    });

                    return (
                      <div
                        key={c.id}
                        className={`group relative p-5 rounded border-2 transition-all cursor-pointer ${
                          activeCaseId === c.id
                            ? 'bg-void border-red shadow-[8px_8px_0px_0px_rgba(159,18,57,0.2)]'
                            : 'bg-void border-white/5 hover:border-white/20'
                        }`}
                        onClick={() => setActiveCaseId(c.id)}
                      >
                        <div className="space-y-3 pr-8">
                          <div className="flex items-center gap-3">
                            <h4
                              className={`text-xs font-bold uppercase tracking-tight truncate italic transition-colors ${activeCaseId === c.id ? 'text-red' : 'text-white/60 group-hover:text-white'}`}
                            >
                              {c.name || 'NULL_SESSION_LOG'}
                            </h4>
                            {hasUrgentHearing && (
                              <AlertCircle className="w-3 h-3 text-red animate-pulse" />
                            )}
                          </div>

                          <div className="h-1 bg-void/5 rounded-sm overflow-hidden border border-white/5">
                            <motion.div
                              className={`h-full transition-all duration-500 ${activeCaseId === c.id ? 'bg-red' : 'bg-void/20'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-[9px] text-text-tertiary font-extrabold tracking-widest uppercase italic opacity-40">
                              SEQ_{done}/{c.steps.length}
                            </p>
                            <span
                              className={`text-[9px] font-mono font-bold ${activeCaseId === c.id ? 'text-red' : 'text-white/20'}`}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCase(c.id);
                          }}
                          className="absolute right-4 top-5 p-2 rounded text-text-tertiary hover:bg-red/10 hover:text-red opacity-0 group-hover:opacity-100 transition-all border-2 border-transparent hover:border-red/20 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right — Active Case details */}
          <div className="space-y-12">
            {activeCase ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Case Status Hero Card */}
                <div className="p-12 rounded bg-red text-white shadow-[16px_16px_0px_0px_rgba(159,18,57,0.4)] border-2 border-red-light/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-void/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] uppercase font-extrabold tracking-[0.5em] opacity-80 italic">
                          SESSION_PRIME_OBJECTIVE
                        </span>
                        <div className="h-[2px] w-16 bg-void/30" />
                        <span className="text-[10px] font-mono tracking-widest opacity-60">
                          REF_ID://{activeCase.id.slice(-12)}
                        </span>
                      </div>
                      <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter italic leading-none">
                        {activeCase.name}
                      </h2>
                      <div className="flex items-center gap-4">
                        <p className="text-[11px] font-extrabold tracking-[0.3em] uppercase opacity-80 italic border-l-4 border-white/30 pl-6 bg-void/5 py-2 pr-6">
                          STATUS:{' '}
                          {progressPercent === 100
                            ? 'OPERATIONAL_DECREE_COMPLETE'
                            : 'IN_PROGRESS_SEQUENTIAL_EXECUTION'}
                        </p>
                        <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest italic">
                          {CASE_TEMPLATES[activeCase.caseType]?.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 bg-void/20 p-6 rounded border-2 border-white/10 backdrop-blur-sm">
                      <span className="text-[11px] font-extrabold tracking-[0.4em] opacity-80 uppercase italic">
                        PIPELINE_LOAD
                      </span>
                      <span className="text-6xl font-display font-bold italic tracking-tighter">
                        {progressPercent}%
                      </span>
                      <div className="w-48 h-3 bg-void/5 rounded overflow-hidden border-2 border-white/10 shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          className="h-full bg-void shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1fr,360px] gap-12">
                  <div className="space-y-12">
                    {/* Upcoming Alerts Area */}
                    {upcomingHearings.length > 0 && (
                      <div className="p-8 rounded bg-void border-2 border-red/60 shadow-[12px_12px_0px_0px_rgba(225,29,72,0.1)] space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red/10 blur-3xl rounded-full" />
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <AlertCircle className="w-6 h-6 text-red animate-pulse" />
                            <span className="text-[12px] font-extrabold text-red uppercase tracking-[0.4em] italic">
                              CRITICAL_TIMELINE_ALERTS
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-red opacity-60">
                            COUNT_{upcomingHearings.length}
                          </span>
                        </div>
                        <div className="space-y-4 relative z-10">
                          {upcomingHearings.slice(0, 3).map((h) => (
                            <div
                              key={h.id}
                              className="flex items-center justify-between p-4 bg-red/5 border-2 border-red/10 rounded group-hover:border-red/30 transition-all"
                            >
                              <span className="text-xs font-bold text-white uppercase tracking-wider italic">
                                {h.label}
                              </span>
                              <span
                                className={`text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border-2 ${h.daysLeft <= 1 ? 'bg-red text-white border-red shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-pulse' : 'bg-void text-red border-red/40'}`}
                              >
                                {h.daysLeft === 0
                                  ? 'DUE: TODAY'
                                  : h.daysLeft === 1
                                    ? 'DUE: TOMORROW'
                                    : `T-MINUS ${h.daysLeft} DAYS`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-10">
                      <label className="text-[12px] font-extrabold uppercase tracking-[0.5em] text-white/40 block mb-8 px-2 italic border-l-4 border-white/5 pl-8">
                        DEPLOYMENT_PIPELINE_STEPS
                      </label>
                      <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {activeCase.steps.map((step, idx) => (
                            <StepItem
                              key={step.id}
                              step={step}
                              index={idx}
                              total={activeCase.steps.length}
                              onToggle={toggleStep}
                              onDelete={deleteStep}
                              onEdit={editStep}
                              onUpdateStep={onUpdateStep}
                            />
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Add step input */}
                      <div className="pt-8 flex gap-4">
                        <input
                          placeholder="DEFINE_NEW_PROCEDURAL_STEP..."
                          className="flex-1 bg-void border-2 border-white/10 rounded px-6 py-5 text-sm text-white focus:outline-none focus:border-red/60 font-display font-extrabold tracking-widest uppercase italic shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] shadow-inner group-hover:border-white/20 transition-all"
                          value={newStepLabel}
                          onChange={(e) => setNewStepLabel(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addStep()}
                        />
                        <button
                          onClick={addStep}
                          className="px-10 bg-red text-white rounded font-extrabold text-[12px] uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(159,18,57,0.3)] hover:bg-red-dark active:translate-x-[1px] active:translate-y-[1px] transition-all italic"
                        >
                          DEPLOY
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="p-10 rounded bg-void border-2 border-white/10 space-y-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue/5 blur-[80px] rounded-full group-hover:bg-blue/10 transition-all" />
                      <label className="text-[12px] uppercase font-extrabold tracking-[0.5em] text-blue flex items-center gap-4 relative z-10 italic">
                        <Users className="w-5 h-5" />
                        <span>CASE_IDENTITY_MATRIX</span>
                      </label>

                      <div className="space-y-10 relative z-10">
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/30 block">
                            CNR_SYSTEM_REF
                          </label>
                          <input
                            value={activeCase.details.caseNumber}
                            onChange={(e) => updateCaseDetails('caseNumber', e.target.value)}
                            placeholder="REF_PENDING..."
                            className="w-full bg-void border-b-2 border-white/10 py-2 text-xs text-white focus:border-blue/60 focus:outline-none font-mono tracking-tight group-hover:border-white/20 transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/30 block">
                            COURT_NODE_TIER
                          </label>
                          <input
                            value={activeCase.details.courtName}
                            onChange={(e) => updateCaseDetails('courtName', e.target.value)}
                            placeholder="NODE_PENDING..."
                            className="w-full bg-void border-b-2 border-white/10 py-2 text-xs text-white focus:border-blue/60 focus:outline-none font-display font-extrabold tracking-widest uppercase italic group-hover:border-white/20 transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/30 block">
                            COUNSEL_MANDATE
                          </label>
                          <input
                            value={activeCase.details.advocateName}
                            onChange={(e) => updateCaseDetails('advocateName', e.target.value)}
                            placeholder="IDENTITY_PENDING..."
                            className="w-full bg-void border-b-2 border-white/10 py-2 text-xs text-white focus:border-blue/60 focus:outline-none font-display font-extrabold tracking-widest uppercase italic group-hover:border-white/20 transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/30 block">
                            NEXT_HEARING_TC
                          </label>
                          <input
                            type="date"
                            value={activeCase.details.nextHearing}
                            onChange={(e) => updateCaseDetails('nextHearing', e.target.value)}
                            className="w-full bg-void border-b-2 border-white/10 py-2 text-xs text-white focus:border-red/60 focus:outline-none font-mono tracking-tight group-hover:border-white/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-24 text-center bg-void rounded border-2 border-white/5 shadow-[24px_24px_0px_0px_rgba(0,0,0,0.8)] space-y-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-red/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-28 h-28 rounded bg-void border-2 border-white/10 flex items-center justify-center mx-auto shadow-inner relative z-10 group-hover:border-red/40 transition-all">
                  <Milestone className="w-14 h-14 text-white/10 group-hover:text-red transition-all duration-500 rotate-12 group-hover:rotate-0" />
                </div>
                <div className="space-y-6 relative z-10">
                  <h3 className="text-4xl font-display font-extrabold text-white uppercase tracking-tighter italic">
                    INITIALIZE_PIPELINE
                  </h3>
                  <p className="text-xs text-text-tertiary font-body uppercase tracking-[0.5em] italic max-w-[400px] mx-auto opacity-50 leading-loose">
                    NO OPERATIONAL SESSIONS DETECTED IN LOCAL STORAGE. PLEASE INJECT A NEW LEGAL
                    MANDATE TO BEGIN SEQUENTIAL TRACKING.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Case Modal */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 bg-void/80 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-void rounded border-2 border-white/10 p-12 max-w-2xl w-full space-y-10 shadow-[32px_32px_0px_0px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red/5 blur-[100px] rounded-full" />
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-red" />
                  <h2 className="text-4xl font-display font-extrabold text-white uppercase tracking-tighter italic">
                    NEW_MANDATE_PROTO
                  </h2>
                </div>
                <p className="text-xs text-text-tertiary font-extrabold uppercase tracking-widest italic opacity-60">
                  SELECT OPERATIONAL TEMPLATE TO GENERATE INITIAL PIPELINE.
                </p>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/40 block px-2 italic">
                    TEMPLATE_SELECTOR
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {CASE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedCaseType(type.id)}
                        className={`p-6 rounded border-2 text-left transition-all ${selectedCaseType === type.id ? 'bg-void border-red shadow-[8px_8px_0px_0px_rgba(225,29,72,0.2)]' : 'bg-void border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'}`}
                      >
                        <p
                          className={`text-xs font-extrabold uppercase tracking-widest italic mb-2 ${selectedCaseType === type.id ? 'text-red' : 'text-white'}`}
                        >
                          {type.name}
                        </p>
                        <p className="text-[9px] text-text-tertiary font-body uppercase tracking-wider italic opacity-70 leading-relaxed">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/40 block px-2 italic">
                    SESSION_LABEL_OVERRIDE
                  </label>
                  <input
                    type="text"
                    value={newCaseName}
                    onChange={(e) => setNewCaseName(e.target.value)}
                    placeholder="ENTER_MANDATE_ID..."
                    className="w-full bg-void border-2 border-white/10 rounded px-6 py-5 text-sm text-white focus:outline-none focus:border-red/60 font-display font-extrabold tracking-widest uppercase italic shadow-inner"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-6 relative z-10">
                <button
                  onClick={() => setShowNewCaseModal(false)}
                  className="flex-1 py-4 rounded border-2 border-white/10 text-text-tertiary font-extrabold text-[11px] uppercase tracking-widest hover:text-white hover:border-white/30 transition-all italic"
                >
                  ABORT_INIT
                </button>
                <button
                  onClick={createNewCase}
                  className="flex-1 py-4 rounded bg-red text-white font-extrabold text-[11px] uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(159,18,57,0.4)] hover:bg-red-dark active:translate-x-[1px] active:translate-y-[1px] transition-all italic"
                >
                  EXECUTE_MANDATE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CNR Lookup Modal */}
      <AnimatePresence>
        {showCNRModal && (
          <div className="fixed inset-0 bg-void/80 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-void rounded border-2 border-white/10 p-12 max-w-2xl w-full space-y-10 shadow-[32px_32px_0px_0px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 blur-[100px] rounded-full" />
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue" />
                  <h2 className="text-4xl font-display font-extrabold text-white uppercase tracking-tighter italic">
                    ECOURTS_SYNC_PROTO
                  </h2>
                </div>
                <p className="text-xs text-text-tertiary font-extrabold uppercase tracking-widest italic opacity-60">
                  SYNCHRONIZE LOCAL SESSION WITH GOVERNMENT JUDICIAL REPOSITORY (CNR).
                </p>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/40 block px-2 italic">
                    CNR_REFERENCE_KEY
                  </label>
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value)}
                    placeholder="e.g., DRHG01-0123456-2024"
                    className="w-full bg-void border-2 border-white/10 rounded px-6 py-5 text-sm text-white focus:outline-none focus:border-blue/60 font-mono tracking-widest uppercase italic shadow-inner"
                  />
                </div>

                <div className="bg-blue/5 border-2 border-blue/20 rounded p-6 shadow-inner">
                  <p className="text-[10px] text-blue font-extrabold tracking-[0.1em] uppercase italic leading-relaxed">
                    <AlertCircle className="w-4 h-4 inline mr-2 -mt-0.5" />
                    NOTICE: ECOURTS_API INTEGRATION IS CURRENTLY IN SIMULATION MODE. DATA
                    PERSISTENCE WILL BE MOCKED UNTIL PRODUCTION HANDSHAKE IS VERIFIED.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 pt-6 relative z-10">
                <button
                  onClick={() => setShowCNRModal(false)}
                  className="flex-1 py-4 rounded border-2 border-white/10 text-text-tertiary font-extrabold text-[11px] uppercase tracking-widest hover:text-white hover:border-white/30 transition-all italic"
                >
                  ABORT_SYNC
                </button>
                <button
                  onClick={lookupCNR}
                  disabled={!cnrNumber.trim()}
                  className="flex-1 py-4 rounded bg-blue text-white font-extrabold text-[11px] uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(37,99,235,0.4)] hover:bg-blue-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all italic"
                >
                  INITIALIZE_SYNC
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
