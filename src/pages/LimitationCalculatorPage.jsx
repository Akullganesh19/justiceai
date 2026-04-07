import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  AlertCircle,
  Calendar,
  ArrowRight,
  BookOpen,
  Scaling,
  FileText,
  Landmark,
  ShieldCheck,
  UserPlus,
  Info as InfoIcon,
  Zap,
} from 'lucide-react';
import Header from '../components/ui/Header.jsx';
import Footer from '../components/ui/Footer.jsx';

const LIMITATION_CATEGORIES = [
  {
    id: 'civil_recovery',
    label: 'Civil Money Recovery',
    limit: 3,
    unit: 'years',
    court: 'Civil Court / Commercial Court',
    desc: 'From the date the loan was made or money became due.',
    act: 'Limitation Act, 1963 (Art. 19-21)',
  },
  {
    id: 'property',
    label: 'Immovable Property Dispute',
    limit: 12,
    unit: 'years',
    court: 'Civil Court',
    desc: 'From the date of dispossession or adverse possession start.',
    act: 'Limitation Act, 1963 (Art. 64/65)',
  },
  {
    id: 'consumer',
    label: 'Consumer Complaint',
    limit: 2,
    unit: 'years',
    court: 'District/State Consumer Commission',
    desc: 'From the date when the cause of action arose.',
    act: 'Consumer Protection Act, 2019 (Sec 69)',
  },
  {
    id: 'mact',
    label: 'Motor Accident Claim (MACT)',
    limit: 6,
    unit: 'months',
    court: 'MACT Tribunal',
    desc: 'Must be filed within 6 months from the date of the accident.',
    act: 'Motor Vehicles (Amendment) Act, 2019',
  },
  {
    id: 'service_matter',
    label: 'Service Matter (Govt Employee)',
    limit: 3,
    unit: 'years',
    court: 'Administrative Tribunal (CAT/SAT)',
    desc: 'Disputes regarding seniority, promotion, or termination.',
    act: 'Administrative Tribunals Act, 1985',
  },
  {
    id: 'arbitration',
    label: 'Arbitration Filing',
    limit: 3,
    unit: 'years',
    court: 'Commercial Court / High Court',
    desc: 'From the date the cause of action arose, not the award date.',
    act: 'Limitation Act / Arbitration Act',
  },
  {
    id: 'rera',
    label: 'RERA Complaint',
    limit: 5,
    unit: 'years',
    court: 'RERA Authority',
    desc: 'Typically within 5 years from the date of possession or agreement.',
    act: 'RERA Act, 2016',
  },
  {
    id: 'it_appeal',
    label: 'Income Tax Appeal',
    limit: 30,
    unit: 'days',
    court: 'ITAT / Commissioner (Appeals)',
    desc: 'From the date of the assessment order.',
    act: 'Income Tax Act, 1961',
  },
  {
    id: 'writ_petition',
    label: 'Writ Petition (Fundamental Rights)',
    limit: 0,
    unit: 'reasonable',
    court: 'High Court (Art 226) / SC (Art 32)',
    desc: 'No fixed limit but "reasonable time" doctrine applies (Laches).',
    act: 'Constitution of India',
  },
  {
    id: 'domestic_violence',
    label: 'Domestic Violence Complaint',
    limit: 0,
    unit: 'none',
    court: 'Magistrate Court',
    desc: 'No limitation period for filing a complaint under PWDVA.',
    act: 'Protection of Women from DV Act, 2005',
  },
  {
    id: 'workmen_comp',
    label: 'Workmen Compensation Claim',
    limit: 2,
    unit: 'years',
    court: 'Labour Commissioner',
    desc: 'From the date of the accident or injury.',
    act: "Workmen's Compensation Act, 1923",
  },
  {
    id: 'criminal_minor',
    label: 'Criminal Case (Minor - <1yr jail)',
    limit: 1,
    unit: 'year',
    court: 'Magistrate Court',
    desc: 'From the date the offense was committed.',
    act: 'B.N.S.S., 2023 (Sec 507)',
  },
  {
    id: 'criminal_medium',
    label: 'Criminal Case (Medium - 1-3 yrs)',
    limit: 3,
    unit: 'years',
    court: 'Magistrate Court',
    desc: 'From the date the offense was committed.',
    act: 'B.N.S.S., 2023 (Sec 507)',
  },
  {
    id: 'criminal_major',
    label: 'Heinous Crimes (Murder, Rape)',
    limit: 0,
    unit: 'none',
    court: 'Sessions Court',
    desc: 'No expiry for heinous crimes.',
    act: 'B.N.S.S., 2023',
  },
  {
    id: 'cheque_bounce',
    label: 'Cheque Bounce (Sec 138)',
    limit: 30,
    unit: 'days',
    court: 'Magistrate Court',
    desc: '30 days to send notice + 30 days to file after notice period.',
    act: 'NI Act, 1881',
  },
];

const COVID_EXCLUSION_START = new Date('2020-03-15');
const COVID_EXCLUSION_END = new Date('2022-02-28');

function TollingCheckbox({ id, label, checked, onChange, info }) {
  return (
    <label
      className={`flex items-start gap-4 p-4 rounded border-2 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] group ${checked ? 'bg-void border-red' : 'bg-void border-white/5 hover:border-white/20'}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-red w-5 h-5 rounded bg-void border-2 border-white/10"
      />
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-extrabold text-white uppercase tracking-widest italic">
            {label}
          </p>
          {info && (
            <div className="group/info relative">
              <InfoIcon className="w-4 h-4 text-white/20 cursor-help hover:text-red transition-all" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-void border-2 border-white/10 rounded shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50 text-[10px] text-text-tertiary uppercase tracking-widest italic leading-relaxed w-72 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,0.5)]">
                <div className="text-red font-bold mb-2">// LEGAL_PROTOCOL_DATA</div>
                {info}
              </div>
            </div>
          )}
        </div>
      </div>
    </label>
  );
}

export default function LimitationCalculatorPage() {
  const [selectedCase, setSelectedCase] = useState('');
  const [incidentDate, setIncidentDate] = useState('');

  // Tolling Scenarios
  const [isMinor, setIsMinor] = useState(false);
  const [defendantOutsideIndia, setDefendantOutsideIndia] = useState('');
  const [fraudSection17, setFraudSection17] = useState(false);
  const [applyCovidExtension, setApplyCovidExtension] = useState(true);

  const activeDoc = useMemo(
    () => LIMITATION_CATEGORIES.find((c) => c.id === selectedCase),
    [selectedCase],
  );

  const calculation = useMemo(() => {
    if (!incidentDate || !activeDoc) return null;
    if (activeDoc.unit === 'none' || activeDoc.unit === 'reasonable') return { type: 'special' };

    let baseDate = new Date(incidentDate);

    // 1. Initial Calculation
    let deadline = new Date(baseDate);
    if (activeDoc.unit === 'years') deadline.setFullYear(baseDate.getFullYear() + activeDoc.limit);
    if (activeDoc.unit === 'months') deadline.setMonth(baseDate.getMonth() + activeDoc.limit);
    if (activeDoc.unit === 'days') deadline.setDate(baseDate.getDate() + activeDoc.limit);

    // 2. COVID-19 Extension Logic (SC Suo Motu Writ Petition No. 3 of 2020)
    // The period from 15.03.2020 to 28.02.2022 was excluded from limitation
    if (applyCovidExtension) {
      const covidStart = COVID_EXCLUSION_START.getTime();
      const covidEnd = COVID_EXCLUSION_END.getTime();
      const incidentTime = baseDate.getTime();
      const deadlineTime = deadline.getTime();

      // If the limitation period intersects with the COVID exclusion period
      if (deadlineTime > covidStart && incidentTime < covidEnd) {
        const overlapStart = Math.max(incidentTime, covidStart);
        const overlapEnd = Math.min(deadlineTime, covidEnd);
        const overlapDays = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24));
        deadline.setDate(deadline.getDate() + overlapDays);
      }
    }

    // 3. Section 17 - Fraud/Mistake/Negotiation
    if (fraudSection17) {
      deadline.setMonth(deadline.getMonth() + 6); // Simple 6 month extension for demo
    }

    // 4. Defendant Outside India (Section 15, Limitation Act)
    if (defendantOutsideIndia) {
      const days = parseInt(defendantOutsideIndia) || 0;
      deadline.setDate(deadline.getDate() + days);
    }

    // 5. Minority - Limitation starts after turning 18
    // We add a simulated 3 year extension or simple logic for demo
    if (isMinor) {
      deadline.setFullYear(deadline.getFullYear() + 2); // Simple representation
    }

    const today = new Date();
    const diffMs = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let urgency = 'safe';
    if (diffDays < 30) urgency = 'critical';
    else if (diffDays < 90) urgency = 'urgent';
    else if (diffDays < 180) urgency = 'warning';

    return {
      deadline,
      diffDays,
      urgency,
      formatted: deadline.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  }, [
    incidentDate,
    activeDoc,
    isMinor,
    defendantOutsideIndia,
    fraudSection17,
    applyCovidExtension,
  ]);

  const getUrgencyText = (u) => {
    switch (u) {
      case 'critical':
        return 'CRITICAL_DEADLINE_VIOLATION_IMMUNIZED';
      case 'urgent':
        return 'URGENT_ADMINISTRATIVE_ATTENTION';
      case 'warning':
        return 'UPCOMING_STATUTORY_DEADLINE';
      default:
        return 'SAFE_DEPLOYMENT_WINDOW';
    }
  };

  const getUrgencyColor = (u) => {
    switch (u) {
      case 'critical':
        return 'text-red shadow-red/20';
      case 'urgent':
        return 'text-yellow-500 shadow-yellow-500/20';
      case 'warning':
        return 'text-blue shadow-blue/10';
      default:
        return 'text-emerald-500 shadow-emerald-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-void pb-8 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-6 pt-32 w-full space-y-10 pb-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-red/10 text-red-light text-[10px] uppercase font-extrabold tracking-[0.4em] rounded border-2 border-red/20 shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)] font-display italic">
            <Clock className="w-4 h-4" />
            <span>Filing_Deadline_Protocol_Terminal</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none italic">
            Right to <span className="text-red">Sue</span>
          </h1>
          <p className="text-lg text-text-tertiary leading-relaxed max-w-2xl mx-auto font-body uppercase tracking-wider italic">
            STATUTORY DEADLINE CALCULATION PARAMETERS. AS PER LIMITATION ACT 1963 AND BNSS 2023
            PROTOCOLS.
          </p>
        </div>

        <div className="bg-void rounded border-2 border-white/5 p-8 md:p-12 space-y-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red/5 -mr-16 -mt-16 rotate-45 group-hover:bg-red/10 transition-all pointer-events-none" />
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/20 italic">
                    1. CASE_CATEGORY_INDEX
                  </label>
                  <select
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                    className="w-full bg-void border-2 border-white/10 rounded px-6 py-5 text-sm text-white focus:outline-none focus:border-red transition-all font-display font-bold uppercase tracking-widest italic appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="" className="bg-void text-white">
                      -- SELECT_MATTER_NODE --
                    </option>
                    {LIMITATION_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-void text-white">
                        {c.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-white/20 italic">
                    2. CAUSE_OF_ACTION_TIMESTAMP
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full bg-void border-2 border-white/10 rounded pl-16 pr-6 py-5 text-sm text-white focus:outline-none focus:border-red transition-all font-display font-bold uppercase tracking-widest italic cursor-pointer shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Tolling/Extension Controls */}
              <div className="space-y-6">
                <p className="text-[10px] uppercase font-extrabold tracking-[0.4em] text-red italic">
                  SUSPENSION_AND_TOLLING_PARAMETERS
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <TollingCheckbox
                    label="MINORITY_PLAINTIFF_STATUS"
                    checked={isMinor}
                    onChange={setIsMinor}
                    info="Under Section 6, the period of limitation counts only after the plaintiff turns 18 (attains majority)."
                  />
                  <TollingCheckbox
                    label="FRAUD_DISCOVERY_SECTION_17"
                    checked={fraudSection17}
                    onChange={setFraudSection17}
                    info="Under Section 17, when a suit is based on fraud, period runs from when it was discovered."
                  />
                  <TollingCheckbox
                    label="APPLY_COVID_19_PROTOCOL"
                    checked={applyCovidExtension}
                    onChange={setApplyCovidExtension}
                    info="Supreme Court excluded 15.03.2020 to 28.02.2022 from limitation calculations due to pandemic disruption."
                  />
                  <div className="p-4 bg-void border-2 border-white/5 rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.3em] italic">
                        DEFENDANT_ABROAD_LOG (DAYS)
                      </p>
                    </div>
                    <input
                      type="number"
                      placeholder="ENTRY_DATA..."
                      value={defendantOutsideIndia}
                      onChange={(e) => setDefendantOutsideIndia(e.target.value)}
                      className="w-full bg-void border-2 border-white/10 rounded px-4 py-2 text-xs text-white focus:outline-none focus:border-red/40 font-mono italic"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Sidebar */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {calculation ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full bg-void rounded border-2 border-white/10 p-8 flex flex-col justify-between shadow-[16px_16px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-red/20 shadow-[0_0_20px_rgba(225,29,72,0.3)]" />
                    {calculation.type === 'special' ? (
                      <div className="space-y-8 text-center py-12">
                        <ShieldCheck className="w-20 h-20 text-blue/40 mx-auto animate-pulse" />
                        <div className="space-y-3">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.5em] text-blue italic">
                            MANDATE_STATUS: PERPETUAL
                          </p>
                          <p className="text-4xl font-display font-bold text-white uppercase tracking-tighter italic">
                            {activeDoc.unit === 'none' ? 'No Expiry' : 'Laches Rule'}
                          </p>
                          <p className="text-[10px] text-text-tertiary uppercase tracking-widest italic opacity-60 leading-relaxed">
                            {activeDoc.desc}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-8">
                          <div className="text-center space-y-4">
                            <p
                              className={`text-[10px] font-extrabold tracking-[0.4em] uppercase italic px-3 py-1 border-2 bg-void rounded inline-block ${getUrgencyColor(calculation.urgency)}`}
                            >
                              {getUrgencyText(calculation.urgency)}
                            </p>
                            <h2 className="text-4xl font-display font-bold text-white uppercase tracking-tighter italic leading-tight">
                              {calculation.formatted.toUpperCase()}
                            </h2>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[.3em] italic">
                              <span className="text-white/20">TIME_REMAINING:</span>
                              <span
                                className={`font-mono ${calculation.diffDays < 30 ? 'animate-pulse text-red' : 'text-blue'}`}
                              >
                                {calculation.diffDays > 0
                                  ? `${calculation.diffDays} DAYS`
                                  : 'EXPIRED'}
                              </span>
                            </div>
                            <div className="h-[2px] bg-void/5 rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                className={`h-full shadow-[0_0_15px_rgba(225,29,72,0.5)] ${calculation.urgency === 'critical' ? 'bg-red' : calculation.urgency === 'urgent' ? 'bg-yellow-500' : 'bg-blue'}`}
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(100, Math.max(0, (calculation.diffDays / 365) * 100))}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="p-6 bg-void border-2 border-white/5 rounded space-y-3 shadow-inner">
                            <div className="flex items-center gap-3 text-red">
                              <Landmark className="w-5 h-5" />
                              <p className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.3em] italic">
                                RECOMMENDED_FORUM
                              </p>
                            </div>
                            <p className="text-base font-display font-bold text-white uppercase italic tracking-tight">
                              {activeDoc.court}
                            </p>
                          </div>
                        </div>

                        <div className="pt-10 border-t-2 border-white/5 mt-10">
                          <button className="w-full bg-red hover:bg-red-dark text-white py-5 rounded border-2 border-red-light/20 font-extrabold flex items-center justify-center gap-4 transition-all active:translate-x-[2px] active:translate-y-[2px] text-[11px] uppercase tracking-[.2em] italic shadow-[8px_8px_0px_0px_rgba(159,18,57,0.4)]">
                            Find <span className="text-white/100">BUREAU_ADVOCATE</span>{' '}
                            <ArrowRight className="w-5 h-5 text-red-light" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <div className="h-full bg-void rounded border-2 border-dashed border-white/10 flex flex-center items-center justify-center p-12 text-center min-h-[400px] shadow-inner">
                    <div className="space-y-6">
                      <Clock className="w-16 h-16 text-white/5 mx-auto" />
                      <p className="text-[10px] text-white/20 uppercase font-extrabold tracking-[0.4em] italic leading-relaxed">
                        AWAITING_CASE_PARAMETERS_FOR_TIMELINE_VISUALIZATION.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Legal Citations Footer */}
          <div className="grid md:grid-cols-2 gap-10 pt-16 border-t-2 border-white/5">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded bg-void border-2 border-blue/20 flex items-center justify-center shrink-0 shadow-inner">
                  <FileText className="w-6 h-6 text-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.4em] mb-2 italic">
                    STATUTORY_BASIS_INDEX
                  </p>
                  <p className="text-sm text-text-tertiary leading-relaxed font-body uppercase tracking-wider italic opacity-80">
                    {activeDoc
                      ? activeDoc.act.toUpperCase()
                      : 'LIMITATION ACT, 1963 GOVERNS THE PERIODS FOR CIVIL SUITS AND VARIOUS FILINGS ACROSS INDIAN COURTS.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-void border-2 border-red/[0.15] p-8 rounded shadow-inner flex items-start gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red/5 -mr-12 -mt-12 rotate-45 pointer-events-none" />
              <AlertCircle className="w-6 h-6 text-red flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <p className="text-[11px] text-red font-extrabold uppercase tracking-[0.3em] italic">
                  PROFESSIONAL_DISCLAIMER_NOTICE
                </p>
                <p className="text-[10px] text-text-tertiary/60 leading-relaxed font-body uppercase tracking-widest italic">
                  CALCULATING LIMITATION IS A COMPLEX LEGAL EXERCISE. SECTION 5 (CONDONATION OF
                  DELAY) AND SECTION 12 (EXCLUSION OF TIME) CAN SHIFT THESE INDICES. ALWAYS CONSULT
                  ADVOCATE_COMMAND_TERMINAL.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
