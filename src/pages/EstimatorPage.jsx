import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  IndianRupee,
  Clock,
  ChevronRight,
  Scale,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react';
import Header from '../components/ui/Header.jsx';
import Footer from '../components/ui/Footer.jsx';

const CASE_TYPES = [
  {
    id: 'consumer',
    label: 'Consumer Complaint',
    icon: '🛒',
    courtFeeBase: 100,
    lawyerRange: [5000, 25000],
    timelineMonths: [3, 12],
    description: 'Consumer Forum - No lawyer required',
  },
  {
    id: 'civil',
    label: 'Civil Suit',
    icon: '⚖️',
    courtFeeBase: 2000,
    lawyerRange: [15000, 100000],
    timelineMonths: [12, 60],
    description: 'District/High Court civil proceedings',
  },
  {
    id: 'criminal',
    label: 'Criminal Case',
    icon: '🔒',
    courtFeeBase: 0,
    lawyerRange: [25000, 200000],
    timelineMonths: [6, 36],
    description: 'FIR, Investigation, Trial',
  },
  {
    id: 'labour',
    label: 'Labour Dispute',
    icon: '👷',
    courtFeeBase: 0,
    lawyerRange: [10000, 50000],
    timelineMonths: [3, 18],
    description: 'Labour Court / Industrial Tribunal',
  },
  {
    id: 'rti',
    label: 'RTI Application',
    icon: '📄',
    courtFeeBase: 10,
    lawyerRange: [0, 0],
    timelineMonths: [1, 3],
    description: 'Right to Information - Self-filing',
  },
  {
    id: 'rent',
    label: 'Rent / Eviction',
    icon: '🏠',
    courtFeeBase: 500,
    lawyerRange: [10000, 50000],
    timelineMonths: [6, 24],
    description: 'Rent Controller / Civil Court',
  },
  {
    id: 'property',
    label: 'Property Dispute',
    icon: '🏗️',
    courtFeeBase: 5000,
    lawyerRange: [25000, 150000],
    timelineMonths: [24, 120],
    description: 'Title suits, injunctions, partition',
  },
  {
    id: 'divorce',
    label: 'Divorce / Family',
    icon: '👨‍👩‍👧',
    courtFeeBase: 1000,
    lawyerRange: [20000, 100000],
    timelineMonths: [6, 36],
    description: 'Family Court proceedings',
  },
];

const COURT_LEVELS = [
  { id: 'district', label: 'District Court / Forum', multiplier: 1 },
  { id: 'state', label: 'State Commission / High Court', multiplier: 2.5 },
  { id: 'national', label: 'National Commission / Supreme Court', multiplier: 5 },
];

const CITY_TIERS = [
  { id: 'tier1', label: 'Metro (Delhi, Mumbai, Bangalore, Chennai)', multiplier: 2.0 },
  { id: 'tier2', label: 'Tier-2 (Pune, Jaipur, Lucknow, Kochi)', multiplier: 1.4 },
  { id: 'tier3', label: 'Tier-3 / Rural', multiplier: 1.0 },
];

const COMPLEXITY_LEVELS = [
  {
    id: 'simple',
    label: 'Simple',
    multiplier: 1.0,
    description: 'Straightforward facts, clear evidence',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    multiplier: 1.5,
    description: 'Multiple parties or contested facts',
  },
  {
    id: 'complex',
    label: 'Complex',
    multiplier: 2.5,
    description: 'Large claims, expert witnesses, appeals',
  },
];

function SelectCard({ item, isSelected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-sm border-2 transition-all duration-300 relative group overflow-hidden ${
        isSelected
          ? 'bg-void border-gold shadow-hard scale-[1.02]'
          : 'bg-void border-white/5 hover:border-white/20'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 w-12 h-12 bg-gold/10 blur-2xl rounded-sm" />
      )}
      {children}
    </button>
  );
}

function ResultCard({ icon: Icon, label, value, sublabel, color = 'gold' }) {
  const colorMap = {
    gold: 'text-gold bg-void border-gold/40 shadow-hard',
    blue: 'text-gold/80 bg-void border-gold/20 shadow-hard',
    success: 'text-gold/90 bg-void border-gold/30 shadow-hard',
    warning: 'text-gold bg-void border-gold shadow-hard',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-sm border-2 bg-void border-white/10 ${colorMap[color] || colorMap.gold} shadow-hard`}
    >
      <div className="flex items-start gap-5">
        <div
          className={`w-12 h-12 rounded-sm border-2 flex items-center justify-center flex-shrink-0 bg-void ${colorMap[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-white/40 mb-1.5">
            {label}
          </p>
          <p className="text-2xl font-display font-bold text-white tracking-tight italic">
            {value}
          </p>
          {sublabel && (
            <p className="text-[10px] text-text-tertiary font-body mt-2 uppercase tracking-widest">
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function EstimatorPage() {
  const [caseType, setCaseType] = useState(null);
  const [courtLevel, setCourtLevel] = useState('district');
  const [cityTier, setCityTier] = useState('tier2');
  const [complexity, setComplexity] = useState('simple');
  const [claimAmount, setClaimAmount] = useState('');

  const estimate = useMemo(() => {
    if (!caseType) return null;

    const caseData = CASE_TYPES.find((c) => c.id === caseType);
    const court = COURT_LEVELS.find((c) => c.id === courtLevel);
    const city = CITY_TIERS.find((c) => c.id === cityTier);
    const comp = COMPLEXITY_LEVELS.find((c) => c.id === complexity);

    if (!caseData || !court || !city || !comp) return null;

    const claim = parseFloat(claimAmount) || 0;

    let courtFee = 0;

    // 1. STATUTORY COURT FEE LOGIC
    if (caseType === 'criminal') {
      courtFee = 0; // State prosecutes
    } else if (caseType === 'rti') {
      courtFee = 10;
    } else if (caseType === 'consumer') {
      // CPA 2019 Slabs
      if (claim <= 500000) courtFee = 0;
      else if (claim <= 1000000) courtFee = 200;
      else if (claim <= 2000000) courtFee = 400;
      else if (claim <= 5000000) courtFee = 2000;
      else if (claim <= 10000000) courtFee = 4000;
      else courtFee = 7500; // National Commission
    } else if (caseType === 'civil' || caseType === 'property') {
      // Ad-valorem (approx 5% capped at 3 Lakhs)
      courtFee = claim > 0 ? Math.min(claim * 0.05, 300000) : 5000;
    } else if (caseType === 'divorce') {
      courtFee = 1000;
    } else {
      courtFee = caseData.courtFeeBase;
    }

    // 2. REALISTIC LAWYER FEES (No more flat multipliers)
    let lawyerMin = 0;
    let lawyerMax = 0;

    const cityBaseRate = cityTier === 'tier1' ? 25000 : cityTier === 'tier2' ? 15000 : 10000;

    if (caseType === 'criminal') {
      lawyerMin = cityBaseRate + (courtLevel === 'district' ? 20000 : 75000);
      lawyerMax = lawyerMin * (comp.id === 'complex' ? 4 : 2);
    } else if (caseType === 'civil' || caseType === 'property') {
      lawyerMin = cityBaseRate + (courtLevel === 'district' ? 30000 : 100000) + claim * 0.02;
      lawyerMax = lawyerMin * (comp.id === 'complex' ? 3 : 2);
    } else if (caseType === 'consumer') {
      lawyerMin = cityBaseRate + (courtLevel === 'district' ? 0 : 25000);
      lawyerMax = lawyerMin * 2 + 30000;
    } else if (caseType === 'divorce') {
      lawyerMin = cityBaseRate + (comp.id === 'simple' ? 15000 : 40000); // Simple = mutual consent
      lawyerMax = lawyerMin * 3;
    } else if (caseType === 'rti') {
      lawyerMin = 0;
      lawyerMax = 0;
    } else {
      lawyerMin = cityBaseRate * 2;
      lawyerMax = cityBaseRate * 5;
    }

    lawyerMin = Math.round(lawyerMin / 1000) * 1000;
    lawyerMax = Math.round(lawyerMax / 1000) * 1000;

    // 3. MISC COSTS (Notary, Clerks, Affidavits)
    const stampDuty = caseType === 'rti' ? 0 : Math.max(100, Math.round(courtFee * 0.1));
    const miscExpenses = caseType === 'rti' ? 50 : Math.max(500, lawyerMin * 0.05);

    // 4. TIMELINES
    const timeMin = Math.round(caseData.timelineMonths[0] * comp.multiplier);
    const timeMax = Math.round(caseData.timelineMonths[1] * comp.multiplier);

    // Totals
    const totalMin = courtFee + stampDuty + miscExpenses + lawyerMin;
    const totalMax = courtFee + stampDuty + miscExpenses + lawyerMax;

    let statutoryBasis = 'Standard baseline court fee estimate';
    if (caseType === 'criminal')
      statutoryBasis = 'No court fee for state prosecution (CrPC / BNSS)';
    else if (caseType === 'rti')
      statutoryBasis = 'Standard fee under Right to Information Act 2005';
    else if (caseType === 'consumer')
      statutoryBasis = 'Court fee calculated per Consumer Protection Act 2019, Schedule rules';
    else if (caseType === 'civil' || caseType === 'property')
      statutoryBasis = 'Ad-valorem fee per Court Fees Act 1870, Section 7';
    else if (caseType === 'divorce')
      statutoryBasis = 'Fixed fee per Family Courts Act 1984 / Hindu Marriage Act 1955';
    else if (caseType === 'rent')
      statutoryBasis = 'State-specific Rent Control Act court fee schedules';
    else if (caseType === 'labour')
      statutoryBasis = 'Nominal fees under Industrial Disputes Act 1947';

    return {
      courtFee: Math.round(courtFee),
      stampDuty: Math.round(stampDuty),
      miscExpenses: Math.round(miscExpenses),
      lawyerMin,
      lawyerMax,
      timeMin,
      timeMax,
      totalMin: Math.round(totalMin),
      totalMax: Math.round(totalMax),
      caseData,
      statutoryBasis,
    };
  }, [caseType, courtLevel, cityTier, complexity, claimAmount]);

  const formatCurrency = (val) => `₹${val.toLocaleString('en-IN')}`;
  const formatTimeline = (min, max) => {
    if (min === max) return `~${min} months`;
    return `${min}-${max} months`;
  };

  return (
    <div className="min-h-screen bg-void pb-32 font-mono text-slate-200">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 space-y-12 pb-24">
        {/* Page Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-gold/5 text-gold text-[10px] uppercase font-extrabold tracking-[0.4em] rounded-sm border-2 border-gold/20 shadow-hard font-display italic">
            <Calculator className="w-4 h-4" />
            <span>FISCAL_ANALYSIS_PROTOCOL_V4.2</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none italic">
            FISCAL <span className="text-gold italic">PROJECTION</span> MATRIX
          </h1>
          <p className="text-lg text-text-tertiary leading-relaxed max-w-2xl mx-auto font-body uppercase tracking-wider italic">
            Analyze court fees, counselor mandates, and temporal projections for the Indian
            jurisdiction.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left: Configuration */}
          <div className="space-y-10">
            {/* Step 1: Case Type */}
            <div className="space-y-6">
              <label className="flex items-center gap-4 text-[10px] uppercase font-extrabold tracking-[0.5em] text-gold">
                <span className="w-8 h-8 rounded-sm bg-gold text-midnight flex items-center justify-center text-[10px] font-extrabold shadow-hard italic">
                  01
                </span>
                LOG_CASE_TYPE
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CASE_TYPES.map((ct) => (
                  <SelectCard
                    key={ct.id}
                    item={ct}
                    isSelected={caseType === ct.id}
                    onClick={() => setCaseType(ct.id)}
                  >
                    <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                      {ct.icon}
                    </div>
                    <h4
                      className={`text-xs uppercase font-extrabold tracking-widest italic ${caseType === ct.id ? 'text-gold' : 'text-white/60 group-hover:text-white'}`}
                    >
                      {ct.label}
                    </h4>
                    <p className="text-[9px] text-text-tertiary font-body mt-2 uppercase tracking-wide opacity-50 group-hover:opacity-100 italic">
                      {ct.description}
                    </p>
                  </SelectCard>
                ))}
              </div>
            </div>

            {caseType && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                {/* Step 2: Claim Amount */}
                <div className="space-y-6">
                  <label className="flex items-center gap-4 text-[10px] uppercase font-extrabold tracking-[0.5em] text-gold/80">
                    <span className="w-8 h-8 rounded-sm bg-gold/80 text-midnight flex items-center justify-center text-[10px] font-extrabold shadow-hard italic">
                      02
                    </span>
                    INPUT_CLAIM_VAL
                  </label>
                  <div className="relative max-w-sm">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="number"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      placeholder="ENTER_QUANTUM..."
                      className="w-full bg-void border-2 border-white/10 rounded-sm pl-14 pr-6 py-5 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-gold/60 transition-all font-display font-bold tracking-widest italic shadow-hard"
                    />
                  </div>
                </div>

                {/* Step 3: Court Level */}
                <div className="space-y-6">
                  <label className="flex items-center gap-4 text-[10px] uppercase font-extrabold tracking-[0.5em] text-gold/60">
                    <span className="w-8 h-8 rounded-sm bg-gold/60 text-midnight flex items-center justify-center text-[10px] font-extrabold shadow-hard italic">
                      03
                    </span>
                    COURT_TIER_NODE
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {COURT_LEVELS.map((cl) => (
                      <SelectCard
                        key={cl.id}
                        item={cl}
                        isSelected={courtLevel === cl.id}
                        onClick={() => setCourtLevel(cl.id)}
                      >
                        <Scale
                          className={`w-5 h-5 mb-2 ${courtLevel === cl.id ? 'text-gold' : 'text-text-tertiary'}`}
                        />
                        <h4
                          className={`text-xs font-display font-bold uppercase tracking-widest italic ${courtLevel === cl.id ? 'text-gold' : 'text-white'}`}
                        >
                          {cl.label}
                        </h4>
                      </SelectCard>
                    ))}
                  </div>
                </div>

                {/* Step 4: City Tier */}
                <div className="space-y-6">
                  <label className="flex items-center gap-4 text-[10px] uppercase font-extrabold tracking-[0.5em] text-gold/40">
                    <span className="w-8 h-8 rounded-sm bg-gold/40 text-midnight flex items-center justify-center text-[10px] font-extrabold shadow-hard italic">
                      04
                    </span>
                    LOCATION_INDEX
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {CITY_TIERS.map((ct) => (
                      <SelectCard
                        key={ct.id}
                        item={ct}
                        isSelected={cityTier === ct.id}
                        onClick={() => setCityTier(ct.id)}
                      >
                        <h4
                          className={`text-xs font-display font-bold uppercase tracking-widest italic ${cityTier === ct.id ? 'text-gold' : 'text-white'}`}
                        >
                          {ct.label}
                        </h4>
                      </SelectCard>
                    ))}
                  </div>
                </div>

                {/* Step 5: Complexity */}
                <div className="space-y-6">
                  <label className="flex items-center gap-4 text-[10px] uppercase font-extrabold tracking-[0.5em] text-gold/20">
                    <span className="w-8 h-8 rounded-sm bg-gold/20 text-midnight flex items-center justify-center text-[10px] font-extrabold shadow-hard italic">
                      05
                    </span>
                    COMPLEXITY_FACTOR
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {COMPLEXITY_LEVELS.map((cl) => (
                      <SelectCard
                        key={cl.id}
                        item={cl}
                        isSelected={complexity === cl.id}
                        onClick={() => setComplexity(cl.id)}
                      >
                        <h4
                          className={`text-xs uppercase font-extrabold tracking-widest italic mb-2 ${complexity === cl.id ? 'text-gold' : 'text-white'}`}
                        >
                          {cl.label}
                        </h4>
                        <p className="text-[9px] text-text-tertiary font-body uppercase tracking-wide opacity-50 italic">
                          {cl.description}
                        </p>
                      </SelectCard>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Results Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {!estimate ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-16 rounded-sm bg-void border-2 border-white/5 text-center space-y-8 shadow-hard relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-20 h-20 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center mx-auto shadow-inner relative z-10">
                    <Calculator className="w-10 h-10 text-white/20 group-hover:text-gold transition-colors" />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter italic">
                      INITIALIZE_ENGINE
                    </h3>
                    <p className="text-xs text-text-tertiary font-body uppercase tracking-[0.2em] italic max-w-[240px] mx-auto opacity-60">
                      DEFINE OPERATIONAL PARAMETERS ON THE LEFT TO GENERATE FISCAL PROJECTIONS.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Total Estimate */}
                  <div className="p-10 rounded-sm bg-gold text-midnight shadow-hard border-2 border-white/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-void/10 blur-3xl rounded-sm" />
                    <p className="text-[10px] uppercase font-extrabold tracking-[0.4em] opacity-80 mb-2 relative z-10">
                      AGGREGATE_ESTIMATE_MAX
                    </p>
                    <p className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter italic relative z-10 leading-none">
                      {formatCurrency(estimate.totalMin)}{' '}
                      <span className="text-midnight/40 text-2xl">..</span>{' '}
                      {formatCurrency(estimate.totalMax)}
                    </p>
                    <div className="mt-6 pt-6 border-t border-midnight/10 relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80 italic">
                        {estimate.caseData.label}
                      </span>
                      <span className="text-[9px] font-mono tracking-widest opacity-60 uppercase">
                        PROJECTION_VER_4.2
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2 bg-void border-2 border-white/5 rounded-sm shadow-inner relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gold animate-pulse" />
                    <Scale className="w-4 h-4 text-gold opacity-80" />
                    <p className="text-[9px] text-text-tertiary font-extrabold uppercase tracking-widest italic opacity-80">
                      BASIS: {estimate.statutoryBasis}
                    </p>
                  </div>

                  <ResultCard
                    icon={Scale}
                    label="STATUTORY_COURT_FEES"
                    value={formatCurrency(estimate.courtFee)}
                    sublabel={
                      estimate.caseData.id === 'consumer'
                        ? 'CPA 2019 SLAB_PROTOCOL'
                        : estimate.caseData.id === 'civil' || estimate.caseData.id === 'property'
                          ? estimate.courtFee >= 300000
                            ? 'AD_VALOREM_LIMIT_APPLIED'
                            : 'AD_VALOREM_%_INDEX'
                          : 'NOMINAL_FILING_FEE'
                    }
                    color="gold"
                  />
                  <ResultCard
                    icon={IndianRupee}
                    label="STAMP_AND_ADMIN_EXPENSE"
                    value={formatCurrency(estimate.stampDuty + estimate.miscExpenses)}
                    sublabel="NOTARY_AFFIDAVIT_LOGS"
                    color="gold"
                  />

                  {estimate.lawyerMax > 0 && (
                    <ResultCard
                      icon={TrendingUp}
                      label="COUNSELOR_MANDATE_EST"
                      value={`${formatCurrency(estimate.lawyerMin)} - ${formatCurrency(estimate.lawyerMax)}`}
                      sublabel="EXPERIENCE_AND_REPUTATION_VARIANCE"
                      color="gold"
                    />
                  )}

                  <ResultCard
                    icon={Clock}
                    label="TEMPORAL_RESOLUTION_WINDOW"
                    value={formatTimeline(estimate.timeMin, estimate.timeMax)}
                    sublabel="FILING_TO_FINAL_DECREE"
                    color="gold"
                  />

                  {/* Disclaimer */}
                  <div className="p-6 rounded-sm bg-void border-2 border-gold shadow-hard">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-gold font-extrabold uppercase tracking-widest leading-relaxed italic">
                        ⚠ FISCAL_NOTICE: THESE ARE ANALYTICAL PROJECTIONS BASED ON GENERAL REVENUE
                        DATA. ACTUAL FISCAL VARIANCE MAY OCCUR BY JURISDICTION AND COUNSELOR CHOICE.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
