import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Goal,
  BookOpen,
  Zap,
  Timer,
  Filter,
  Share2,
  ExternalLink,
  Lightbulb,
  FileText,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { DAILY_FACTS } from '../data/dailyFacts';

const QUIZ_QUESTIONS = [
  // --- BNS / BNSS / BSA (CRITICAL UPDATES) ---
  {
    id: 101,
    category: 'Criminal (BNS)',
    difficulty: 'Medium',
    question:
      'Under the Bharatiya Nyaya Sanhita (BNS), which section now covers the offence of Murder?',
    options: ['Section 302', 'Section 101', 'Section 103', 'Section 299'],
    correct: 2,
    explanation:
      'Section 103 of BNS replaces IPC 302 for Punishment for Murder. Section 101 defines Murder itself.',
    source: 'BNS Section 103',
    glossaryId: 1,
  },
  {
    id: 102,
    category: 'Criminal (BNS)',
    difficulty: 'Hard',
    question:
      'Section 302 of the BNS, which formerly dealt with Murder in the IPC, now covers which offence?',
    options: ['Culpable Homicide', 'Theft', 'Snatching', 'Kidnapping'],
    correct: 2,
    explanation:
      'In a major remapping, Section 302 of the BNS now deals with Snatching. Murder was moved to Section 103.',
    source: 'BNS Section 302',
    glossaryId: 36,
  },
  {
    id: 103,
    category: 'Criminal (BNS)',
    difficulty: 'Easy',
    question:
      'On what date did the new criminal laws (BNS, BNSS, BSA) officially come into force in India?',
    options: ['1 January 2024', '1 April 2024', '1 July 2024', '15 August 2024'],
    correct: 2,
    explanation:
      'The Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) came into force on 1 July 2024.',
    source: 'MHA Notification',
  },
  {
    id: 104,
    category: 'Criminal (BNS)',
    difficulty: 'Medium',
    question: 'Which new act replaced the Indian Evidence Act of 1872?',
    options: [
      'Bharatiya Nyaya Sanhita',
      'Bharatiya Nagarik Suraksha Sanhita',
      'Bharatiya Sakshya Adhiniyam',
      'Bharatiya Digital Evidence Act',
    ],
    correct: 2,
    explanation:
      'The Bharatiya Sakshya Adhiniyam (BSA) 2023 replaced the 151-year-old Indian Evidence Act.',
    source: 'BSA 2023',
  },
  // --- CONSTITUTIONAL ---
  {
    id: 1,
    category: 'Constitutional',
    difficulty: 'Easy',
    question:
      'Which Article of the Indian Constitution guarantees the Right to Life and Personal Liberty?',
    options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
    correct: 2,
    explanation:
      'Article 21 states: "No person shall be deprived of his life or personal liberty except according to a procedure established by law."',
    source: 'Constitution of India Art. 21',
    glossaryId: 48,
  },
  {
    id: 201,
    category: 'Constitutional',
    difficulty: 'Hard',
    question: 'Which landmark case established the "Basic Structure Doctrine" in India?',
    options: [
      'Maneka Gandhi Case',
      'Kesavananda Bharati Case',
      'A.K. Gopalan Case',
      'Minerva Mills Case',
    ],
    correct: 1,
    explanation:
      'The 1973 Kesavananda Bharati case established that Parliament cannot amend the basic structure of the Constitution.',
    source: 'Kesavananda Bharati v. Kerala',
    glossaryId: 46,
  },
  // --- CONSUMER ---
  {
    id: 301,
    category: 'Consumer',
    difficulty: 'Medium',
    question:
      'What is the maximum time limit for filing a consumer complaint under the Consumer Protection Act, 2019?',
    options: ['1 year', '2 years', '3 years', '5 years'],
    correct: 1,
    explanation:
      'A consumer complaint must generally be filed within 2 years from the date the cause of action arose.',
    source: 'CPA 2019 Section 69',
    glossaryId: 70,
  },
  // --- RTI ---
  {
    id: 401,
    category: 'RTI',
    difficulty: 'Easy',
    question:
      'What is the standard time limit for a Public Information Officer (PIO) to respond to an RTI request?',
    options: ['15 days', '30 days', '45 days', '60 days'],
    correct: 1,
    explanation:
      'Under Section 7 of the RTI Act, the PIO must respond within 30 days. If it concerns life/liberty, it is 48 hours.',
    source: 'RTI Act 2005 Section 7',
    glossaryId: 98,
  },
  // --- DIGITAL ---
  {
    id: 501,
    category: 'Digital',
    difficulty: 'Medium',
    question: 'The Digital Personal Data Protection Act (2023) applies to which of the following?',
    options: [
      'Only physical data',
      'Personal data in digital form',
      'Offline data without digitizing',
      'Only data stored outside India',
    ],
    correct: 1,
    explanation:
      'The DPDP Act 2023 applies to personal data in digital form or data collected offline and later digitized.',
    source: 'DPDP Act 2023 Section 3',
    glossaryId: 165,
  },
  // --- RERA ---
  {
    id: 601,
    category: 'RERA',
    difficulty: 'Hard',
    question:
      'Under RERA, what percentage of project funds must builders deposit in an escrow account?',
    options: ['30%', '50%', '70%', '100%'],
    correct: 2,
    explanation:
      'Section 4 of RERA requires 70% of project collections to be kept in a separate account for project completion.',
    source: 'RERA 2016 Section 4',
  },
  // --- WOMEN / POSH ---
  {
    id: 701,
    category: 'Women Rights',
    difficulty: 'Easy',
    question:
      'The POSH Act mandates an Internal Committee (IC) in organizations with at least how many employees?',
    options: ['5 employees', '10 employees', '20 employees', '50 employees'],
    correct: 1,
    explanation:
      'Every organization with 10 or more employees must form an Internal Committee to address sexual harassment.',
    source: 'POSH Act 2013 Section 4',
    glossaryId: 16,
  },
];

const CATEGORIES = [
  'All',
  'Criminal (BNS)',
  'Constitutional',
  'Consumer',
  'RTI',
  'RERA',
  'Digital',
  'Women Rights',
];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

function DailyFact() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % DAILY_FACTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const fact = DAILY_FACTS[factIndex];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-void border-2 border-white/5 rounded-sm p-5 flex items-start gap-5 shadow-hard"
    >
      <div className="w-12 h-12 rounded-sm bg-void border-2 border-gold/20 flex items-center justify-center shrink-0 shadow-inner">
        <Lightbulb className="w-6 h-6 text-gold animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-gold mb-1 italic opacity-60">
          STATUTORY_FACT_STREAM
        </p>
        <p className="text-sm text-text-tertiary leading-relaxed font-body uppercase tracking-wider italic">
          "{fact.fact}"
        </p>
        <p className="text-[9px] text-white/20 mt-2 font-mono italic uppercase tracking-widest">
          // SOURCE_INDEX: {fact.source}
        </p>
      </div>
    </motion.div>
  );
}

function QuizCard({ question, selectedAnswer, onSelect, showResult, index, total }) {
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'text-blue bg-blue/10 border-blue/20';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Hard':
        return 'text-gold bg-gold/10 border-gold/20';
      default:
        return 'text-white bg-void/10 border-white/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-gold px-3 py-1 bg-gold/10 rounded border-2 border-gold/20 italic">
            {question.category}
          </span>
          <span
            className={`text-[10px] uppercase font-extrabold tracking-[0.3em] px-3 py-1 rounded border-2 italic ${getDifficultyColor(question.difficulty)}`}
          >
            {question.difficulty}
          </span>
          <div className="flex-1" />
          <span className="text-[10px] text-white/20 uppercase font-extrabold tracking-[0.4em] italic leading-none">
            QUESTION_{index + 1} / {total}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight uppercase tracking-tighter italic">
          {question.question}
        </h3>
      </div>

      <div className="space-y-4">
        {question.options.map((option, i) => {
          let borderClass = 'border-white/5 hover:border-white/20';
          let bgClass = 'bg-void';
          let textClass = 'text-white/60';

          if (showResult) {
            if (i === question.correct) {
              borderClass = 'border-blue/50';
              bgClass = 'bg-blue/10';
              textClass = 'text-blue';
            } else if (i === selectedAnswer && i !== question.correct) {
              borderClass = 'border-gold/50';
              bgClass = 'bg-gold/10';
              textClass = 'text-gold font-bold';
            }
          } else if (i === selectedAnswer) {
            borderClass = 'border-gold-light/40';
            bgClass = 'bg-gold/5';
            textClass = 'text-white font-bold';
          }

          return (
            <button
              key={i}
              onClick={() => !showResult && onSelect(i)}
              disabled={showResult}
              className={`w-full text-left p-5 rounded-sm border-2 transition-all duration-300 flex items-center gap-5 shadow-hard group ${borderClass} ${bgClass}`}
            >
              <span
                className={`w-10 h-10 rounded-sm border-2 flex items-center justify-center text-sm font-display font-extrabold flex-shrink-0 transition-all ${
                  showResult && i === question.correct
                    ? 'border-blue bg-blue text-white shadow-hard'
                    : showResult && i === selectedAnswer && i !== question.correct
                      ? 'border-gold bg-gold text-midnight shadow-hard'
                      : i === selectedAnswer
                        ? 'border-gold bg-gold text-midnight shadow-hard animate-pulse'
                        : 'border-white/10 text-white/20 group-hover:border-white/30 group-hover:text-white/40'
                }`}
              >
                {showResult && i === question.correct ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : showResult && i === selectedAnswer && i !== question.correct ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span
                className={`text-[13px] font-display font-bold uppercase tracking-wider italic transition-all ${textClass}`}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-sm border-2 border-blue/20 bg-void space-y-5 shadow-hard"
        >
          <div className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-sm bg-void border-2 border-blue/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-blue mb-2 italic opacity-60">
                STATUTORY_EXPLANATION_DATA
              </p>
              <p className="text-sm text-text-tertiary leading-relaxed font-body uppercase tracking-wider italic opacity-80">
                {question.explanation}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-blue/10">
                <span className="text-[10px] text-blue/40 font-mono font-bold uppercase tracking-widest italic">
                  // SOURCE_INDEX: {question.source}
                </span>
                {question.glossaryId && (
                  <button
                    onClick={() => (window.location.href = `/glossary#term-${question.glossaryId}`)}
                    className="flex items-center gap-2 text-[10px] text-blue hover:text-white font-extrabold uppercase tracking-[0.2em] italic transition-all group"
                  >
                    ACCESS_FULL_LEXICON{' '}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function LegalQuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [shared, setShared] = useState(false);

  // Filter Logic
  const filteredQuestions = useMemo(() => {
    let qs = QUIZ_QUESTIONS;
    if (selectedCategory !== 'All') qs = qs.filter((q) => q.category === selectedCategory);
    if (selectedDifficulty !== 'All') qs = qs.filter((q) => q.difficulty === selectedDifficulty);
    return qs;
  }, [selectedCategory, selectedDifficulty]);

  const currentQuestion = filteredQuestions[currentIndex];
  const selectedAnswer = answers[currentQuestion?.id];

  const score = useMemo(() => {
    return filteredQuestions.reduce((acc, q) => {
      if (answers[q.id] === q.correct) acc++;
      return acc;
    }, 0);
  }, [answers, filteredQuestions]);

  const attemptedCount = Object.keys(answers).length;
  const percentage =
    filteredQuestions.length > 0 ? Math.round((score / filteredQuestions.length) * 100) : 0;

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
    setQuizComplete(false);
  };

  const shareResults = () => {
    const text = `I scored ${score}/${filteredQuestions.length} on JusticeAI Legal Quiz! Grade: ${getGrade().label}. Test your legal knowledge at JusticeAI.`;
    navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const getGrade = () => {
    if (percentage === 100)
      return {
        label: 'SENIOR_COUNSEL_LEVEL',
        color: 'text-gold shadow-luxe',
        msg: 'EXCEPTIONAL_MASTERY_OF_INDIAN_JURISPRUDENCE!',
      };
    if (percentage >= 75)
      return { label: 'ADVOCATE_LEVEL', color: 'text-blue', msg: 'SOLID_LEGAL_FOUNDATION_VERIFIED.' };
    if (percentage >= 50)
      return {
        label: 'LAW_PROBATIONER',
        color: 'text-white',
        msg: 'ACCEPTABLE_PROGRESS. CONTINUE_LEGAL_SYNC.',
      };
    return {
      label: 'FOUNDATIONAL_LEVEL',
      color: 'text-gold/60',
      msg: 'INSUFFICIENT_DATA. RESTART_ASSESSMENT_TO_VERIFY.',
    };
  };

  return (
    <div className="min-h-screen bg-void pb-16 font-mono">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-32 space-y-12 pb-24 w-full">
        {/* Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-4 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[11px] uppercase font-extrabold tracking-[0.5em] italic rounded-sm shadow-luxe">
            <Brain className="w-5 h-5" />
            <span>LEGAL_APTITUDE_FRAMEWORK_V4.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none italic text-white">
            LEGAL <span className="text-gold">MASTERY</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.3em] italic opacity-60">
            MODERNIZED FOR 2024 STANDARDS. ASSESSING READINESS FOR BNS, BNSS, AND BSA PROCEDURES WITH VERIFIED INDICES.
          </p>
        </div>

        {/* Fact Marquee */}
        {!quizComplete && <DailyFact />}

        {!quizComplete ? (
          <>
            <div className="grid md:grid-cols-2 gap-8 bg-void p-8 rounded-sm border-2 border-white/5 shadow-hard">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/20 italic">
                  // SELECT_CATEGORIES_STRATA
                </label>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentIndex(0);
                      }}
                      className={`px-4 py-2 rounded-sm border-2 text-[9px] font-extrabold uppercase tracking-widest transition-all italic shadow-hard ${selectedCategory === cat ? 'bg-gold border-gold-light/40 text-midnight shadow-hard' : 'bg-void border-white/5 text-white/40 hover:text-white hover:border-white/20'}`}
                    >
                      {cat.replace(' ', '_')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/20 italic">
                  // DIFFICULTY_PROTOCOL
                </label>
                <div className="flex gap-3">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        setSelectedDifficulty(diff);
                        setCurrentIndex(0);
                      }}
                      className={`px-4 py-2 rounded-sm border-2 text-[9px] font-extrabold uppercase tracking-widest transition-all italic shadow-hard ${selectedDifficulty === diff ? 'bg-gold border-gold-light/40 text-midnight' : 'bg-void border-white/5 text-white/40 hover:text-white hover:border-white/20'}`}
                    >
                      {diff.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-5">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.5em] italic">
                <span className="text-white/20">PROGRESS_TRACKER_SYNC</span>
                <span className="text-gold">
                  QUESTION_{currentIndex + 1} / {filteredQuestions.length || 0}
                </span>
              </div>
              <div className="h-[4px] bg-void/5 rounded-sm overflow-hidden shadow-inner border border-white/5">
                <motion.div
                  className="h-full bg-gold shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                  animate={{
                    width: `${((currentIndex + 1) / (filteredQuestions.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            {filteredQuestions.length > 0 ? (
              <div className="bg-void rounded-sm border-2 border-white/5 p-12 md:p-16 shadow-hard relative overflow-hidden group">
               {/* Institutional Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 -mr-24 -mt-24 rotate-45 group-hover:bg-gold/10 transition-all pointer-events-none border border-gold/10" />
                <AnimatePresence mode="wait">
                  <QuizCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelect={handleSelect}
                    showResult={showResult}
                    index={currentIndex}
                    total={filteredQuestions.length}
                  />
                </AnimatePresence>

                <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t-2 border-white/5 relative z-10">
                  <div className="text-[10px] text-white/20 font-extrabold uppercase tracking-[0.5em] italic">
                    QUESTIONS_ATTEMPTED:{' '}
                    <span className="text-white">
                      {attemptedCount} / {filteredQuestions.length}
                    </span>
                  </div>
                  {!showResult ? (
                    <button
                      onClick={() => setShowResult(true)}
                      disabled={selectedAnswer === undefined}
                      className="flex items-center gap-4 bg-gold hover:bg-gold-dark disabled:opacity-10 disabled:cursor-not-allowed text-midnight px-12 py-5 rounded-sm border-2 border-gold-light/20 font-extrabold uppercase tracking-[0.3em] transition-all active:translate-y-[2px] shadow-luxe italic"
                    >
                      <Goal className="w-5 h-5 shadow-luxe" /> VERIFY_RESPONSE
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (currentIndex < filteredQuestions.length - 1) {
                          setCurrentIndex((prev) => prev + 1);
                          setShowResult(false);
                        } else {
                          setQuizComplete(true);
                        }
                      }}
                      className="flex items-center gap-4 bg-blue hover:bg-blue-dark text-white px-12 py-5 rounded-sm border-2 border-blue-light/20 font-extrabold uppercase tracking-[0.3em] transition-all active:translate-y-[2px] shadow-hard-blue italic"
                    >
                      <span className="tracking-[0.4em]">
                        {currentIndex < filteredQuestions.length - 1
                          ? 'NEXT_QUESTION'
                          : 'COMPLETE_ASSESSMENT'}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-32 bg-void rounded-sm border-2 border-dashed border-white/10 shadow-hard space-y-8 italic">
                <p className="text-lg font-display font-bold text-white/20 uppercase tracking-[0.8em]">
                  NULL_SET_DETECTED
                </p>
                <p className="text-[10px] text-white/10 uppercase tracking-widest leading-relaxed">
                  // NO_QUESTIONS_MATCH_SPECIFIED_PARAMETERS_INPUT_STRATA
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                  }}
                  className="px-12 py-4 rounded-sm border-2 border-white/10 text-white/40 text-[10px] font-extrabold uppercase tracking-[0.4em] hover:text-white hover:border-white/30 transition-all italic"
                >
                  PURGE_PARAMETERS_ID
                </button>
              </div>
            )}
          </>
        ) : (
          /* Results Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-16"
          >
            <div className="bg-void rounded-sm border-2 border-white/10 p-16 text-center space-y-12 relative overflow-hidden shadow-hard">
               {/* Institutional Grid Pattern */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
              
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gold shadow-[0_0_30px_rgba(212,175,55,0.5)]" />

              <div className="relative">
                <div className="w-32 h-32 rounded-sm bg-void border-4 border-gold flex items-center justify-center mx-auto shadow-hard animate-pulse">
                  <Trophy className="w-16 h-16 text-gold" />
                </div>
                <motion.div 
                  className="absolute inset-0 border-4 border-gold rounded-sm opacity-0 pointer-events-none"
                  animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>

              <div className="space-y-6 relative z-10">
                <p className="text-[11px] uppercase font-extrabold tracking-[0.6em] text-white/20 italic">
                  // FINAL_LEGAL_APTITUDE_RATING
                </p>
                <h2
                  className={`text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter italic ${getGrade().color}`}
                >
                  {getGrade().label}
                </h2>
                <p className="text-xs text-text-tertiary uppercase tracking-[0.3em] italic opacity-60 max-w-md mx-auto leading-relaxed">
                  {getGrade().msg}
                </p>
              </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8">
                {[
                  { val: score, label: 'VERIFIED_RESPONSES', color: 'text-white' },
                  { val: filteredQuestions.length - score, label: 'INCORRECT_RESPONSES', color: 'text-gold' },
                  { val: `${percentage}%`, label: 'PRECISION_INDEX', color: 'text-blue' },
                  { val: 'FAST', label: 'RESPONSE_TYPE', color: 'text-gold animate-pulse', icon: Zap }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-void p-8 rounded-sm border-2 border-white/5 shadow-hard flex flex-col items-center justify-center space-y-2">
                    {stat.icon ? <stat.icon className={`w-8 h-8 ${stat.color}`} /> : <p className={`text-4xl font-display font-bold italic ${stat.color}`}>{stat.val}</p>}
                    <p className="text-[8px] uppercase font-extrabold tracking-[0.3em] text-white/20 italic">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
                <button
                  onClick={shareResults}
                  className="flex items-center justify-center gap-4 bg-void border-2 border-white/10 hover:border-white text-white px-12 py-5 rounded-sm font-extrabold uppercase tracking-[0.4em] transition-all w-full sm:w-auto italic shadow-hard active:translate-y-[2px]"
                >
                  <Share2 className="w-5 h-5 text-blue" /> {shared ? 'RESULTS_COPIED' : 'SHARE_RESULTS'}
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-4 bg-gold hover:bg-gold-dark text-midnight px-12 py-5 rounded-sm border-2 border-gold-light/20 font-extrabold uppercase tracking-[0.4em] transition-all w-full sm:w-auto italic shadow-luxe active:translate-y-[4px]"
                >
                  <RotateCcw className="w-5 h-5" /> RESTART_ASSESSMENT
                </button>
              </div>
            </div>

            {/* Detailed Review */}
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-l-4 border-gold pl-6">
                <FileText className="w-6 h-6 text-gold" />
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter italic">
                  STATUTORY_ANNOTATIONS_INDEX_LOG
                </h3>
              </div>
              <div className="grid gap-6">
                {filteredQuestions.map((q, i) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correct;
                  return (
                    <div
                      key={q.id}
                      className={`p-10 rounded-sm border-2 transition-all shadow-hard group ${isCorrect ? 'bg-void border-blue/20 hover:border-blue/40' : 'bg-void border-gold/20 hover:border-gold/40'}`}
                    >
                      <div className="flex items-start gap-8">
                        <div
                          className={`w-12 h-12 rounded-sm border-2 flex items-center justify-center shrink-0 font-display font-extrabold italic shadow-hard ${isCorrect ? 'bg-blue border-blue-light/30 text-white' : 'bg-gold border-gold-light/30 text-midnight'}`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="space-y-5 flex-1 min-w-0">
                          <p className="text-xl font-display font-bold text-white uppercase tracking-tight italic leading-tight group-hover:text-white transition-colors">
                            {q.question}
                          </p>
                          <div className="flex flex-wrap gap-x-12 gap-y-3 border-t-2 border-white/5 pt-5">
                            <div className="space-y-1">
                               <p className="text-[8px] uppercase font-extrabold tracking-[0.3em] text-white/20 italic">USER_INPUT_PROTOCOL</p>
                               <p className={`text-xs uppercase font-extrabold italic tracking-wider ${isCorrect ? 'text-blue' : 'text-gold'}`}>
                                 {q.options[userAnswer] || 'TERMINATED_NO_INPUT'}
                               </p>
                            </div>
                            {!isCorrect && (
                              <div className="space-y-1">
                                 <p className="text-[8px] uppercase font-extrabold tracking-[0.3em] text-white/20 italic">MANDATED_INDEX_REFERENCE</p>
                                 <p className="text-xs text-blue uppercase font-extrabold italic tracking-wider">{q.options[q.correct]}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 pt-2 pb-1">
                             <div className="w-4 h-[2px] bg-gold/20" />
                             <p className="text-[9px] text-white/20 font-mono italic uppercase tracking-[0.3em]">
                               // VERIFICATION_SOURCE_NODE: {q.source}
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
