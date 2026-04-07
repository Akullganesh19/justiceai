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
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '../components/ui/Toast.jsx';
import Header from '../components/ui/Header.jsx';
import Footer from '../components/ui/Footer.jsx';

// Case type specific milestone templates
const CASE_TEMPLATES = {
  consumer: {
    name: 'CONSUMER_PETITION',
    description: 'Statutory complaint under Consumer Protection Act, 2019',
    steps: [
      {
        id: 1,
        label: 'Archive Essential Documentation',
        description: 'Collect bills, receipts, correspondence, product photos',
        completed: false,
      },
      {
        id: 2,
        label: 'Serve Statutory Notice',
        description: 'Send legal notice to opposite party under Section 72 of CPA 2019',
        completed: false,
        expectedDays: 30,
      },
      {
        id: 3,
        label: 'Draft Formal Petition',
        description: 'Prepare complaint with facts, relief sought, and documents',
        completed: false,
      },
      {
        id: 4,
        label: 'File with Competent Commission',
        description: 'File at District/State/National Commission based on pecunary value',
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
    name: 'CRIMINAL_PROCEEDING',
    description: 'Procedural lifecycle under BNS/BNSS framework',
    steps: [
      {
        id: 1,
        label: 'FIR_REGISTRATION',
        description: 'Formal First Information Report registration via physical or digital portal',
        completed: false,
      },
      {
        id: 2,
        label: 'INVESTIGATION_PHASE',
        description: 'Executive investigation and evidentiary collection by authorities',
        completed: false,
      },
      {
        id: 3,
        label: 'CHARGESHEET_SUBMISSION',
        description: 'Formal filing of chargesheet under BNSS Section 193',
        completed: false,
      },
      {
        id: 4,
        label: 'JUDICIAL_PRODUCTION',
        description: 'Accused produced before competent Magistrate for remand',
        completed: false,
      },
      {
        id: 5,
        label: 'BAIL_ADJUDICATION',
        description: 'Submission and adjudication of regular/anticipatory bail petitions',
        completed: false,
      },
      {
        id: 6,
        label: 'FRAMING_OF_CHARGES',
        description: 'Judicial determination of charges under relevant statutory sections',
        completed: false,
      },
      {
        id: 7,
        label: 'PROSECUTION_EVIDENCE',
        description: 'Submission of prosecution witnesses and verified evidence',
        completed: false,
      },
      {
        id: 8,
        label: 'CROSS_EXAMINATION',
        description: 'Procedural cross-examination of prosecution witnesses',
        completed: false,
      },
      {
        id: 9,
        label: 'DEFENSE_EVIDENCE',
        description: 'Presentation of defense witnesses and counter-evidence',
        completed: false,
      },
      {
        id: 10,
        label: 'FINAL_ARGUMENTS',
        description: 'Procedural final arguments by both side councils',
        completed: false,
      },
      { id: 11, label: 'FINAL_ADJUDICATION', description: 'Judicial pronouncement of verdict', completed: false },
      {
        id: 12,
        label: 'SENTENCING_PROTOCOL',
        description: 'Pronouncement of sentence or initiation of appellate proceedings',
        completed: false,
      },
    ],
  },
  civil: {
    name: 'CIVIL_SUIT_FILING',
    description: 'Procedural lifecycle for statutory civil litigation',
    steps: [
      {
        id: 1,
        label: 'DRAFT_PLAINT',
        description: 'Preparation of formal plaint specifying cause of action and relief sought',
        completed: false,
      },
      {
        id: 2,
        label: 'FILING_OF_SUIT',
        description: 'Formal submission of suit at the competent civil court of jurisdiction',
        completed: false,
      },
      {
        id: 3,
        label: 'STATUTORY_COURT_FEE',
        description: 'Payment of ad valorem court fees based on relief valuation',
        completed: false,
      },
      {
        id: 4,
        label: 'ADMISSION_&_SUMMONS',
        description: 'Judicial admission of suit and issuance of formal summons',
        completed: false,
      },
      {
        id: 5,
        label: 'SERVICE_OF_SUMMONS',
        description: 'Verification of summons service to the defendant party',
        completed: false,
      },
      {
        id: 6,
        label: 'WRITTEN_STATEMENT',
        description: 'Filing of formal written statement by the defendant within statutory limits',
        completed: false,
      },
      {
        id: 7,
        label: 'FRAMING_OF_ISSUES',
        description: 'Judicial determination and framing of issues for formal trial',
        completed: false,
      },
      {
        id: 8,
        label: 'PLAINTIFF_EVIDENCE',
        description: 'Submission of evidence by plaintiff (Witnesses & Documents)',
        completed: false,
      },
      {
        id: 9,
        label: 'DEFENDANT_EVIDENCE',
        description: 'Submission of evidence by defendant party',
        completed: false,
      },
      {
        id: 10,
        label: 'FINAL_ARGUMENTS',
        description: 'Procedural final arguments based on framed trial issues',
        completed: false,
      },
      { id: 11, label: 'FINAL_ADJUDICATION', description: 'Judicial pronouncement of judgment', completed: false },
      {
        id: 12,
        label: 'EXECUTION_PROTOCOL',
        description: 'Execution of decree or initiation of appellate proceedings',
        completed: false,
      },
    ],
  },
  rera: {
    name: 'RERA_PROCEEDING',
    description: 'Regulatory complaint under Real Estate Authority framework',
    steps: [
      {
        id: 1,
        label: 'DOCUMENT_ARCHIVAL',
        description: 'Collection of agreement, payment receipts, and RERA registration markers',
        completed: false,
      },
      {
        id: 2,
        label: 'NOTICE_TO_DEVELOPER',
        description: 'Issuance of formal statutory notice for deficiency or delay',
        completed: false,
        expectedDays: 30,
      },
      {
        id: 3,
        label: 'FILE_RERA_COMPLAINT',
        description: 'Formal submission of complaint at the State RERA Authority portal',
        completed: false,
      },
      { id: 4, label: 'FILING_FEE_SETTLEMENT', description: 'Settlement of mandated Rs. 5,000 regulatory fee', completed: false },
      {
        id: 5,
        label: 'ADMISSION_HEARING',
        description: 'First listing and admission hearing by RERA Authority',
        completed: false,
      },
      {
        id: 6,
        label: 'REPLY_BY_DEVELOPER',
        description: 'Developer party files formal reply or procedural objections',
        completed: false,
      },
      {
        id: 7,
        label: 'EVIDENTIARY_HEARING',
        description: 'Presentation of verified evidence and final arguments',
        completed: false,
      },
      {
        id: 8,
        label: 'REGULATORY_ORDER',
        description: 'Receipt of formal order for refund or statutory compensation',
        completed: false,
      },
    ],
  },
  chequebounce: {
    name: 'NI_ACT_SECTION_138',
    description: 'Negotiable Instruments Act procedural timeline',
    steps: [
      {
        id: 1,
        label: 'CHEQUE_DISHONOR',
        description: 'Issuance of bank return memo marking cheque dishonor',
        completed: false,
      },
      {
        id: 2,
        label: 'STATUTORY_DEMAND_NOTICE',
        description: 'Issuance of demand notice within 30 days of dishonor',
        completed: false,
        expectedDays: 30,
      },
      {
        id: 3,
        label: 'COOLING_OFF_PERIOD',
        description: 'Mandated 15-day waiting period for payment post-notice',
        completed: false,
        expectedDays: 15,
      },
      {
        id: 4,
        label: 'FILING_OF_COMPLAINT',
        description: 'Formal filing of criminal complaint under Section 138 of NI Act',
        completed: false,
      },
      {
        id: 5,
        label: 'SUMMONS_ISSUANCE',
        description: 'Judicial issuance of summons to the accused party',
        completed: false,
      },
      {
        id: 6,
        label: 'JUDICIAL_APPEARANCE',
        description: 'Appearance of accused and filing of formal reply',
        completed: false,
      },
      {
        id: 7,
        label: 'EVIDENTIARY_PHASE',
        description: 'Submission of original memo, notice, and service proof',
        completed: false,
      },
      { id: 8, label: 'FINAL_ARGUMENTS', description: 'Submission of arguments for conviction', completed: false },
      { id: 9, label: 'FINAL_ADJUDICATION', description: 'Judicial pronouncement of verdict', completed: false },
      {
        id: 10,
        label: 'COMPENSATION_EXECUTION',
        description: 'Receipt of compensation or filing of appellate proceeding',
        completed: false,
      },
    ],
  },
  family: {
    name: 'MATRIMONIAL_STATUTORY_CONTEST',
    description: 'Statutory proceedings under Personal Laws and Family Court framework',
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
    name: 'AUTONOMOUS_STATUTORY_TRACE',
    description: 'Create a custom procedural timeline',
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
      className="flex gap-6"
    >
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onToggle(step.id)}
          className={`w-12 h-12 rounded-sm bg-void border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-hard active:translate-y-[2px] ${completedBefore ? 'bg-gold border-gold/40 text-midnight' : 'bg-void border-white/10 text-white/20 hover:border-gold/50 hover:text-gold'}`}
        >
          {completedBefore ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-sm bg-white/20" />
          )}
        </button>
        {!isLast && (
          <div
            className={`w-[1px] flex-1 min-h-[50px] transition-all duration-500 ${completedBefore ? 'bg-gold/30' : 'bg-white/5'}`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div
          className={`p-8 rounded-sm border-2 transition-all duration-500 shadow-hard ${completedBefore ? 'bg-void border-gold/40 shadow-gold/5' : 'bg-void border-white/5 hover:border-white/10 group-hover:border-white/20'}`}
        >
          {isEditing ? (
            <div className="space-y-6">
              <input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-full bg-void border-2 border-white/10 rounded-sm px-6 py-4 text-[15px] text-white focus:outline-none focus:border-gold/60 font-display font-bold uppercase tracking-tight italic shadow-hard"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className="w-full bg-void border-2 border-white/10 rounded-sm px-6 py-4 text-[14px] text-white focus:outline-none focus:border-gold/60 font-body italic resize-none shadow-hard"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-3 px-8 py-3 bg-gold text-midnight rounded-sm font-extrabold text-[10px] uppercase tracking-widest shadow-hard active:translate-y-[2px] italic border-2 border-gold/40"
                >
                  <Save className="w-4 h-4" /> COMMIT_CHANGES
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-3 px-8 py-3 bg-midnight border border-white/10 text-white/60 rounded-sm font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span
                    className={`text-[9px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-sm border ${completedBefore ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-midnight border-white/10 text-white/30'}`}
                  >
                    Phase {index + 1}
                  </span>
                  {completedBefore && (
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
                      Completed
                    </span>
                  )}
                  {daysLeft !== null && daysLeft >= 0 && !completedBefore && (
                    <div
                      className={`text-[9px] font-extrabold uppercase tracking-[0.3em] px-4 py-1.5 rounded-sm border-2 shadow-hard flex items-center gap-2 italic ${daysLeft <= 3 ? 'bg-gold/10 border-gold/40 text-gold animate-pulse' : 'bg-void border-white/5 text-text-tertiary opacity-40'}`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      {daysLeft === 0
                        ? 'DUE_STATUTORY_TODAY'
                        : daysLeft === 1
                          ? 'DUE_TOMORROW'
                          : `${daysLeft}_DAYS_REMAINING`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-3 rounded-sm hover:bg-white/5 text-text-tertiary hover:text-gold transition-all border border-transparent hover:border-white/10"
                  >
                    {showDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-3 rounded-sm hover:bg-white/5 text-text-tertiary hover:text-gold transition-all border border-transparent hover:border-white/10"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(step.id)}
                    className="p-3 rounded-sm hover:bg-red-500/5 text-text-tertiary hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3
                className={`text-xl font-display font-bold uppercase tracking-tight ${completedBefore ? 'text-emerald-400' : 'text-white'}`}
              >
                {step.label}
              </h3>
              <p className="text-[13px] text-text-tertiary font-body mt-2 leading-relaxed opacity-60 italic">
                {step.description}
              </p>

              {showDetails && (
                <div className="mt-8 pt-8 border-t border-white/5 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <input
                        type="date"
                        value={step.expectedDate || ''}
                        onChange={(e) => onUpdateStep(step.id, { expectedDate: e.target.value })}
                        className="w-full bg-void border-2 border-white/5 rounded px-5 py-3.5 text-[10px] text-white focus:outline-none focus:border-gold/40 shadow-inner font-mono italic"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase font-extrabold tracking-widest text-white/20 block ml-2 italic">
                        Completion Date
                      </label>
                      <input
                        type="date"
                        value={step.completedDate || ''}
                        onChange={(e) => onUpdateStep(step.id, { completedDate: e.target.value })}
                        className="w-full bg-void border-2 border-white/5 rounded px-5 py-3.5 text-[10px] text-white focus:outline-none focus:border-blue/40 shadow-inner font-mono italic"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase font-extrabold tracking-widest text-white/20 block ml-2 italic">
                      Strategic Notes
                    </label>
                    <textarea
                      value={step.notes || ''}
                      onChange={(e) => onUpdateStep(step.id, { notes: e.target.value })}
                      placeholder="Add case observations or notes..."
                      rows={2}
                      className="w-full bg-void border-2 border-white/10 rounded-sm px-5 py-4 text-[13px] text-white focus:outline-none focus:border-gold/40 font-body italic resize-none shadow-hard transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase font-extrabold tracking-widest text-white/20 block ml-2 italic">
                      Document Reference
                    </label>
                    <input
                      type="text"
                      value={step.documentRef || ''}
                      onChange={(e) => onUpdateStep(step.id, { documentRef: e.target.value })}
                      placeholder="Enter reference ID or title..."
                      className="w-full bg-void border-2 border-white/10 rounded-sm px-5 py-3.5 text-xs text-white focus:outline-none focus:border-gold/40 font-display font-bold uppercase tracking-widest italic shadow-hard transition-all placeholder:text-white/10"
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
      // Notification logic can go here
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
    success({ title: 'Stage Added', message: `"${newStepLabel}" has been added to the case timeline.` });
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
    success({ title: 'Case Created', message: `${template.name} has been initialized successfully.` });
  };

  const deleteCase = (caseId) => {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    if (activeCaseId === caseId) {
      setActiveCaseId(cases.find((c) => c.id !== caseId)?.id);
    }
    showError({ title: 'Case Removed', message: 'The case record has been permanently deleted.' });
  };

  const updateCaseDetails = (field, value) => {
    updateActiveCase((c) => ({ ...c, details: { ...c.details, [field]: value } }));
  };

  const lookupCNR = async () => {
    if (!cnrNumber.trim()) return;
    success({
      title: 'eCourts Synchronization',
      message: `Fetching details for CNR: ${cnrNumber}. Government API integration is currently in demonstration mode.`,
    });
    setShowCNRModal(false);
  };

  const getUpcomingHearings = () => {
    if (!activeCase) return [];
    return activeCase.steps
      .filter((s) => s.expectedDate && !s.completed)
      .map((s) => ({ ...s, daysLeft: daysUntil(s.expectedDate) }))
      .filter((s) => s.daysLeft !== null && s.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const upcomingHearingsList = getUpcomingHearings();

  return (
    <div className="min-h-screen bg-void pb-16 font-mono">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32 space-y-16 pb-24">
        {/* Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[10px] uppercase font-extrabold tracking-[0.5em] italic rounded-sm shadow-luxe font-display">
            <Milestone className="w-5 h-5" />
            <span>CASE_LIFECYCLE_TRACKER_V4.0</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter leading-none italic text-white text-center">
            PROCEDURAL <span className="text-gold">TRACKER</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.3em] italic opacity-60">
            MONITOR PROCEDURAL LIFECYCLE AND STATUTORY MILESTONES. ARCHIVE ESSENTIAL DOCUMENTATION FOR BNS, BNSS, AND CIVIL LITIGATION FLOWS.
          </p>
        </div>

        <div className="grid lg:grid-cols-[380px,1fr] gap-16">
          {/* Left sidebar — case list */}
          <div className="space-y-10">
            <div className="flex gap-4">
              <button
                onClick={() => setShowNewCaseModal(true)}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-5 bg-gold text-midnight rounded-sm border-2 border-gold/40 font-extrabold text-[10px] uppercase tracking-widest shadow-hard hover:bg-gold-dark active:translate-y-[2px] transition-all italic"
              >
                <Plus className="w-5 h-5" /> INITIALIZE_LIFECYCLE
              </button>
              <button
                onClick={() => setShowCNRModal(true)}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-void border-2 border-white/5 rounded-sm text-[10px] font-extrabold text-white uppercase tracking-widest hover:border-gold/30 transition-all shadow-hard active:translate-y-[2px] italic"
              >
                <Search className="w-5 h-5 text-gold" /> SYNC_CNR_PROTOCOL
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="w-1 h-6 bg-white/20 rounded-sm" />
                <label className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-text-tertiary opacity-40 italic">
                  ACTIVE_LIFECYCLES
                </label>
              </div>
              
              {cases.length === 0 ? (
                <div className="p-16 text-center bg-void rounded border-2 border-white/5 shadow-inner space-y-6">
                  <div className="w-20 h-20 rounded bg-void border-2 border-white/5 flex items-center justify-center mx-auto text-white/5 shadow-luxe">
                    <Milestone className="w-10 h-10" />
                  </div>
                  <p className="text-[10px] text-text-tertiary leading-relaxed font-extrabold uppercase tracking-[0.3em] opacity-40 italic">
                    NO_CONSULTATION_RECORDS_FOUND.<br/>INITIALIZE_LIFECYCLE_TO_BEGIN.
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
                        className={`group relative p-6 rounded-sm border-2 transition-all cursor-pointer shadow-hard ${
                          activeCaseId === c.id
                            ? 'bg-void border-gold/40 shadow-gold/5'
                            : 'bg-void border-white/5 hover:border-white/10 transition-all'
                        }`}
                        onClick={() => setActiveCaseId(c.id)}
                      >
                        <div className="space-y-4 pr-8">
                          <div className="flex items-center gap-3">
                            <h4
                              className={`text-[11px] font-display font-bold uppercase tracking-[0.2em] italic truncate transition-colors ${activeCaseId === c.id ? 'text-gold' : 'text-white/40 group-hover:text-white'}`}
                            >
                              {c.name || 'UNTITLED_RECORD_REF'}
                            </h4>
                            {hasUrgentHearing && (
                              <AlertCircle className="w-4 h-4 text-gold animate-pulse" />
                            )}
                          </div>

                          <div className="h-2 bg-void border-2 border-white/5 rounded-sm overflow-hidden shadow-inner">
                            <motion.div
                              className={`h-full transition-all duration-500 ${activeCaseId === c.id ? 'bg-gold shadow-hard' : 'bg-white/10'}`}
                              animate={{ width: `${pct}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] text-text-tertiary font-bold tracking-widest uppercase opacity-40">
                              Stage {done}/{c.steps.length}
                            </p>
                            <span
                              className={`text-[10px] font-medium ${activeCaseId === c.id ? 'text-gold' : 'text-white/20'}`}
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
                          className="absolute right-4 top-4 p-3 rounded-sm text-text-tertiary hover:bg-red-500/5 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-500/20 shadow-sm"
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
          <div className="space-y-16">
            {activeCase ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Case Status Hero Card */}
                <div className="p-12 md:p-16 rounded-sm bg-gold text-midnight shadow-hard border-2 border-gold/40 relative overflow-hidden group/hero">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 blur-[100px] rounded-sm -translate-y-1/2 translate-x-1/2 opacity-50 group-hover/hero:opacity-70 transition-opacity" />
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] uppercase font-bold tracking-widest border-b-2 border-midnight/20 pb-1">
                          Consolidated Overview
                        </span>
                        <div className="h-[1px] w-12 bg-midnight/20" />
                        <span className="text-[10px] font-bold tracking-widest opacity-60">
                          Ref: {activeCase.id.slice(-12).toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tight leading-none text-midnight">
                        {activeCase.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-6">
                        <p className="text-[10px] font-extrabold tracking-widest uppercase bg-midnight/5 px-6 py-2.5 rounded-sm border-2 border-midnight/10 shadow-sm italic">
                          {progressPercent === 100
                            ? 'PROCEEDINGS_CONCLUDED'
                            : 'ACTIVE_STRATEGIC_EXECUTION'}
                        </p>
                        <span className="text-[10px] font-extrabold text-midnight/50 uppercase tracking-widest bg-white/10 px-6 py-2.5 rounded-sm border-2 border-midnight/5 italic">
                          {CASE_TEMPLATES[activeCase.caseType]?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4 bg-white/10 p-10 rounded-sm border-2 border-white/20 backdrop-blur-md shadow-hard min-w-[240px] italic">
                      <span className="text-[10px] font-extrabold tracking-widest opacity-60 uppercase text-midnight">
                        EFFICIENCY_PRECISION_INDEX
                      </span>
                      <span className="text-7xl font-display font-bold tracking-tighter text-midnight leading-none">
                        {progressPercent}%
                      </span>
                      <div className="w-full h-3 bg-midnight/5 rounded-sm overflow-hidden border-2 border-white/10 shadow-inner mt-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          className="h-full bg-midnight shadow-hard"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1fr,380px] gap-16">
                  <div className="space-y-16">
                    {/* Upcoming Alerts Area */}
                    {upcomingHearingsList.length > 0 && (
                      <div className="p-10 rounded-sm bg-void border-2 border-gold/40 shadow-hard space-y-8 relative overflow-hidden group/alerts">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[100px] rounded-sm group-hover/alerts:bg-gold/10 transition-all" />
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-sm bg-void border-2 border-gold/20 flex items-center justify-center text-gold shadow-hard">
                              <AlertCircle className="w-5 h-5 text-gold animate-pulse" />
                            </div>
                            <span className="text-[10px] font-extrabold text-gold uppercase tracking-[0.3em] italic">
                              STATUTORY_ALERTS_NODE
                            </span>
                          </div>
                          <span className="text-[9px] font-black text-gold opacity-40 italic tracking-widest uppercase">
                            {upcomingHearingsList.length} PENDING_MANDATES
                          </span>
                        </div>
                        <div className="space-y-4 relative z-10">
                          {upcomingHearingsList.slice(0, 3).map((h) => (
                            <div
                              key={h.id}
                              className="flex items-center justify-between p-6 bg-void border-2 border-white/5 rounded-sm hover:border-gold/30 transition-all shadow-hard group/alert"
                            >
                              <span className="text-sm font-display font-bold text-white uppercase tracking-tight italic opacity-90 group-hover/alert:text-gold transition-colors">
                                {h.label}
                              </span>
                              <span
                                className={`text-[9px] font-extrabold uppercase tracking-widest px-6 py-2.5 rounded-sm border-2 shadow-hard italic ${h.daysLeft <= 1 ? 'bg-gold text-midnight border-gold/40 animate-pulse' : 'bg-void text-gold border-gold/20'}`}
                              >
                                {h.daysLeft === 0
                                  ? 'DUE_TODAY'
                                  : h.daysLeft === 1
                                    ? 'DUE_TOMORROW'
                                    : `${h.daysLeft}_DAYS_REMAIN`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-12">
                      <div className="flex items-center gap-6 px-4">
                        <div className="w-2 h-8 bg-white/10 rounded-sm" />
                        <label className="text-[12px] font-bold uppercase tracking-widest text-text-tertiary opacity-40">
                          Timeline Progression
                        </label>
                      </div>
                      
                      <div className="space-y-4">
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
                      <div className="pt-12 flex gap-6">
                        <div className="relative flex-1 group">
                          <input
                            placeholder="Add a new stage to your timeline..."
                            className="w-full bg-void border-2 border-white/10 rounded-sm px-8 py-6 text-[13px] text-white focus:outline-none focus:border-gold/60 font-body transition-all shadow-hard placeholder:text-white/10 italic"
                            value={newStepLabel}
                            onChange={(e) => setNewStepLabel(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addStep()}
                          />
                        </div>
                        <button
                          onClick={addStep}
                          className="px-12 bg-gold text-midnight rounded-sm font-extrabold text-[10px] uppercase tracking-widest shadow-hard hover:bg-gold-dark active:translate-y-[2px] transition-all whitespace-nowrap border-2 border-gold/40 italic"
                        >
                          ADD_PROCURAL_STAGE
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="p-10 rounded-sm bg-void border-2 border-white/10 space-y-12 shadow-hard relative overflow-hidden group/details">
                      <div className="absolute top-0 right-0 w-56 h-56 bg-gold/5 blur-[100px] rounded-sm group-hover/details:bg-gold/10 transition-all pointer-events-none" />
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-sm bg-void border-2 border-gold/20 flex items-center justify-center text-gold shadow-hard">
                          <Building className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] text-gold font-extrabold uppercase tracking-[0.3em] opacity-60 italic">ENTITY_MANAGEMENT_NODE</p>
                          <label className="text-xl font-display font-bold text-white uppercase tracking-tight italic">
                            INSTITUTION_DETAILS
                          </label>
                        </div>
                      </div>

                      <div className="space-y-10 relative z-10">
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-2">
                            CNR Number
                          </label>
                          <input
                            value={activeCase.details.caseNumber}
                            onChange={(e) => updateCaseDetails('caseNumber', e.target.value)}
                            placeholder="Not provided"
                            className="w-full bg-midnight-slate/20 border-b border-white/10 py-4 text-sm text-white focus:border-gold/60 focus:outline-none font-bold tracking-widest uppercase transition-all placeholder:opacity-20"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-2">
                            Court Authority
                          </label>
                          <input
                            value={activeCase.details.courtName}
                            onChange={(e) => updateCaseDetails('courtName', e.target.value)}
                            placeholder="Not specified"
                            className="w-full bg-midnight-slate/20 border-b border-white/10 py-4 text-sm text-white focus:border-gold/60 focus:outline-none font-bold tracking-widest uppercase transition-all placeholder:opacity-20"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-2">
                            Legal Counsel
                          </label>
                          <input
                            value={activeCase.details.advocateName}
                            onChange={(e) => updateCaseDetails('advocateName', e.target.value)}
                            placeholder="Unassigned"
                            className="w-full bg-midnight-slate/20 border-b border-white/10 py-4 text-sm text-white focus:border-gold/60 focus:outline-none font-bold tracking-widest uppercase transition-all placeholder:opacity-20"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-2">
                            NEXT_HEARING_MANDATE
                          </label>
                          <input
                            type="date"
                            value={activeCase.details.nextHearing}
                            onChange={(e) => updateCaseDetails('nextHearing', e.target.value)}
                            className="w-full bg-void border-b-2 border-white/10 py-4 text-sm text-white focus:border-gold/60 focus:outline-none font-bold transition-all italic"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-32 text-center bg-void border-2 border-white/5 shadow-hard space-y-12 relative overflow-hidden group/empty">
                <div className="absolute inset-0 bg-gold/[0.02] blur-[120px] rounded-sm opacity-0 group-hover/empty:opacity-100 transition-opacity" />
                <div className="w-32 h-32 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center mx-auto shadow-hard relative z-10 group-hover:border-gold/40 transition-all duration-700 group-hover:-rotate-6">
                  <Milestone className="w-16 h-16 text-white/10 group-hover:text-gold transition-all duration-700" />
                </div>
                <div className="space-y-8 relative z-10">
                  <h3 className="text-5xl font-display font-bold text-white uppercase tracking-tighter italic">
                    START_PROGRESS_TRACING
                  </h3>
                  <p className="text-[10px] text-text-tertiary leading-relaxed max-w-[480px] mx-auto opacity-40 font-extrabold uppercase tracking-[0.3em] italic">
                    NO_ACTIVE_CASE_SESSIONS_FORMULATED.<br/>INITIALIZE_LIFECYCLE_MANDATE_TO_PROCEED.
                  </p>
                  <button
                    onClick={() => setShowNewCaseModal(true)}
                    className="inline-flex items-center gap-4 text-[10px] uppercase font-extrabold tracking-[0.4em] text-gold hover:text-gold-light transition-colors border-b-2 border-gold/20 pb-2 active:translate-y-1 italic"
                  >
                    INITIALIZE_NEW_CASE <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Case Modal */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 bg-void/95 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-void rounded-sm border-2 border-white/10 p-16 max-w-3xl w-full space-y-12 shadow-hard relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[120px] rounded-sm" />
              <div className="space-y-6 relative z-10 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <div className="w-2 h-8 bg-gold rounded-sm shadow-hard" />
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter italic">
                    INITIALIZE_LIFECYCLE
                  </h2>
                </div>
                <p className="text-sm text-text-tertiary/60 font-medium tracking-wide italic">
                  Select a template to generate a professional case timeline and begin strategic tracking.
                </p>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="space-y-6">
                  <label className="text-[11px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-4">
                    Select Case Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto px-2 custom-scrollbar pr-4">
                    {CASE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedCaseType(type.id)}
                        className={`p-8 rounded-sm border-2 text-left transition-all relative overflow-hidden group/opt ${selectedCaseType === type.id ? 'bg-gold border-gold/40 text-midnight' : 'bg-void border-white/5 hover:border-gold/30 hover:bg-gold/5 opacity-60 hover:opacity-100'}`}
                      >
                        <p
                          className={`text-[11px] font-display font-bold uppercase tracking-widest mb-2 ${selectedCaseType === type.id ? 'text-midnight' : 'text-white'}`}
                        >
                          {type.name}
                        </p>
                        <p className={`text-[10px] font-body italic opacity-70 leading-relaxed uppercase tracking-wider ${selectedCaseType === type.id ? 'text-midnight' : 'text-text-tertiary'}`}>
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-4">
                    Case Title
                  </label>
                  <input
                    type="text"
                    value={newCaseName}
                    onChange={(e) => setNewCaseName(e.target.value)}
                    placeholder="Enter case title (e.g., Delhi High Court Writ)"
                    className="w-full bg-midnight border border-white/5 rounded-sm px-8 py-6 text-sm text-white focus:outline-none focus:border-gold/60 font-body transition-all shadow-inner placeholder:opacity-20"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-8 relative z-10">
                <button
                  onClick={() => setShowNewCaseModal(false)}
                  className="flex-1 py-5 rounded-sm border-2 border-white/10 text-text-tertiary font-extrabold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all shadow-hard italic"
                >
                  DISCARD_INITIALIZATION
                </button>
                <button
                  onClick={createNewCase}
                  className="flex-1 py-5 rounded-sm bg-gold text-midnight font-extrabold text-[10px] uppercase tracking-widest shadow-hard hover:bg-gold-dark active:translate-y-[2px] transition-all italic border-2 border-gold/40"
                >
                  ESTABLISH_SESSION_NODE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CNR Lookup Modal */}
      <AnimatePresence>
        {showCNRModal && (
          <div className="fixed inset-0 bg-void/95 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-void rounded-sm border-2 border-white/10 p-16 max-w-3xl w-full space-y-12 shadow-hard relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[120px] rounded-sm" />
              <div className="space-y-6 relative z-10 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <div className="w-2 h-8 bg-gold rounded-sm shadow-hard" />
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter italic">
                    ECOURTS_SYNC_PROTOCOL
                  </h2>
                </div>
                <p className="text-sm text-text-tertiary/60 font-medium tracking-wide italic">
                  Synchronize your local case data with the official judicial repository for real-time status updates.
                </p>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="space-y-4">
                  <label className="text-[11px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-4">
                    CNR Number
                  </label>
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value)}
                    placeholder="e.g., DRHG01-0123456-2024"
                    className="w-full bg-midnight border border-white/5 rounded-sm px-8 py-6 text-sm text-white focus:outline-none focus:border-blue-400/60 font-bold tracking-widest uppercase transition-all shadow-inner placeholder:opacity-20"
                  />
                </div>

                <div className="bg-gold/5 border-2 border-gold/20 rounded-sm p-8 shadow-hard flex items-start gap-5">
                  <AlertCircle className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                  <p className="text-[9px] text-gold font-extrabold tracking-[0.2em] uppercase leading-relaxed opacity-80 italic">
                    GOVERNMENT_API_INTEGRATION_STANDBY. CNR_SYNCHRONIZATION_PENDING_PRODUCTION_HANDSHAKE_VERIFICATION.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-8 relative z-10">
                <button
                  onClick={() => setShowCNRModal(false)}
                  className="flex-1 py-5 rounded-sm border-2 border-white/10 text-text-tertiary font-extrabold text-[10px] uppercase tracking-widest hover:text-white transition-all shadow-hard italic"
                >
                  ABORT_PROTOCOL
                </button>
                <button
                  onClick={lookupCNR}
                  disabled={!cnrNumber.trim()}
                  className="flex-1 py-5 rounded-sm bg-gold text-midnight font-extrabold text-[10px] uppercase tracking-widest shadow-hard hover:bg-gold-dark disabled:opacity-20 disabled:cursor-not-allowed transition-all italic border-2 border-gold/40"
                >
                  ESTABLISH_HANDSHAKE
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
