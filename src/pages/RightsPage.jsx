import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Home,
  Briefcase,
  Users,
  Monitor,
  GraduationCap,
  Scale,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
} from 'lucide-react';
import Header from '../components/ui/Header';

const CATEGORIES = [
  { id: 'all', label: 'All Rights', icon: Scale },
  { id: 'consumer', label: 'Consumer', icon: ShoppingBag },
  { id: 'tenant', label: 'Tenant', icon: Home },
  { id: 'employee', label: 'Employee', icon: Briefcase },
  { id: 'women', label: 'Women', icon: Users },
  { id: 'digital', label: 'Digital', icon: Monitor },
  { id: 'student', label: 'Student', icon: GraduationCap },
];

const RIGHTS_DATA = [
  {
    id: 1,
    category: 'consumer',
    title: 'Right to be Protected Against Hazardous Products',
    summary:
      'Protection against marketing of goods and services that are hazardous to life and property.',
    details:
      'Under the Consumer Protection Act, 2019, every consumer has the right to be protected against the marketing of goods and services which are hazardous to life and property. Product liability claims can be filed against manufacturers, sellers, and service providers.',
    articles: [
      'Section 2(9) — Consumer Protection Act, 2019',
      'Art. 21 — Right to Life includes safety',
    ],
    remedies: [
      'File complaint at District/State/National Consumer Commission',
      'Product liability action under Chapter VI',
      'Claim compensation for injury/damage',
    ],
  },
  {
    id: 2,
    category: 'consumer',
    title: 'Right to Refund for Defective Products',
    summary:
      'Return defective goods and claim a full refund or replacement within warranty period.',
    details:
      "If a product has manufacturing defects or does not match the seller's description, you are entitled to a replacement, repair, or full refund. Filing at Consumer Forum requires no lawyer and a minimal ₹100-₹5000 fee.",
    articles: ['Section 35 — Consumer Protection Act, 2019', 'Section 39 — Remedies available'],
    remedies: [
      'File consumer complaint online at edaakhil.nic.in',
      'No lawyer required for filing',
      'Court fee: ₹100 (claims < ₹5L) to ₹5000 (claims > ₹1Cr)',
    ],
  },
  {
    id: 3,
    category: 'consumer',
    title: 'Right Against Unfair Trade Practices',
    summary:
      'Protection against false advertising, misleading claims, and unfair business tactics.',
    details:
      'Unfair trade practices include false representation about quality, misleading advertisements, and bait-and-switch tactics. The CCPA (Central Consumer Protection Authority) can impose penalties up to ₹10 lakh on first offense.',
    articles: ['Section 2(47) — Unfair Trade Practice definition', 'Section 18 — CCPA powers'],
    remedies: [
      'Complain to CCPA via consumerhelpline.gov.in',
      'File at Consumer Forum',
      'Report misleading ads to ASCI (ascionline.in)',
    ],
  },
  {
    id: 4,
    category: 'tenant',
    title: 'Right to Security Deposit Refund',
    summary:
      'Landlord must return your security deposit (minus legitimate deductions) when you vacate.',
    details:
      'Most state Rent Control Acts mandate return of security deposit within 1-3 months of vacating. Deductions can only be made for actual damage beyond normal wear and tear, with itemized proof. In many states, unreasonable withholding is actionable.',
    articles: ['State Rent Control Acts (varies by state)', 'Model Tenancy Act, 2021 — Section 11'],
    remedies: [
      'Send legal notice demanding return within 15 days',
      'File civil suit in Small Causes Court',
      'Approach Rent Authority (if state has adopted Model Tenancy Act)',
    ],
  },
  {
    id: 5,
    category: 'tenant',
    title: 'Right Against Arbitrary Eviction',
    summary: 'A landlord cannot evict you without proper legal process and valid grounds.',
    details:
      'Eviction requires proper notice (usually 1-3 months), valid legal grounds (non-payment, personal use, subletting without consent, etc.), and a court order. Self-help eviction (changing locks, cutting utilities) is illegal.',
    articles: [
      'State Rent Control Acts',
      'Art. 21 — Right to shelter as part of Right to Life',
      'Model Tenancy Act, 2021 — Section 22',
    ],
    remedies: [
      'File police complaint if forceful eviction attempted',
      'Approach Rent Controller/Civil Court for stay',
      'File suit for injunction against landlord',
    ],
  },
  {
    id: 6,
    category: 'tenant',
    title: 'Right to Essential Services',
    summary:
      'Landlord cannot cut electricity, water, or other essential services to force eviction.',
    details:
      'Cutting essential services is a criminal offense under most state laws. Even during disputes, landlords must maintain basic services. You can file a police complaint (criminal intimidation) and approach the Rent Controller.',
    articles: [
      'Section 503/506 IPC — Criminal Intimidation',
      'State Rent Control Acts',
      'Art. 21 — Right to dignified living',
    ],
    remedies: [
      'File police complaint immediately',
      'Approach Rent Controller for restoration order',
      'File civil suit for mandatory injunction',
    ],
  },
  {
    id: 7,
    category: 'employee',
    title: 'Right to Minimum Wages',
    summary:
      'Every worker is entitled to wages not below the minimum wage fixed by the government.',
    details:
      'The Code on Wages, 2019 (replacing the Minimum Wages Act) mandates a floor wage set by the Central Government. State governments can set higher minimums. Both scheduled and non-scheduled employment are covered.',
    articles: ['Code on Wages, 2019 — Section 6', 'Art. 43 — Living wage for workers (DPSP)'],
    remedies: [
      'Complain to Labour Commissioner',
      'File claim in Labour Court',
      'Helpline: 1800-11-0039 (Shram Suvidha)',
    ],
  },
  {
    id: 8,
    category: 'employee',
    title: 'Right Against Wrongful Termination',
    summary:
      'Employer must follow due process for termination including notice period and valid grounds.',
    details:
      'Under the Industrial Disputes Act and employment contracts, retrenchment requires 1 month notice or pay in lieu, valid grounds, and compliance with "last in, first out" principle. Establishments with 100+ workers need government permission.',
    articles: [
      'Industrial Disputes Act, 1947 — Section 25F',
      'Art. 14 — Equality; Art. 16 — Equal opportunity',
    ],
    remedies: [
      'File complaint with Labour Commissioner',
      'Approach Labour Court/Industrial Tribunal',
      'Constitutional remedy via High Court (Art. 226) for government employees',
    ],
  },
  {
    id: 9,
    category: 'employee',
    title: 'Right to Workplace Safety',
    summary: 'Every employee has the right to a safe working environment free from hazards.',
    details:
      'The Occupational Safety, Health and Working Conditions Code, 2020 covers workplace safety. Employers must provide safety equipment, training, health checkups, and maintain safe premises. Violation can result in imprisonment up to 2 years.',
    articles: [
      'OSH Code, 2020 — Chapter III & IV',
      'Art. 21 — Right to healthy working conditions',
      'Factories Act, 1948 — Sections 11-20',
    ],
    remedies: [
      'Report to Factory Inspector / Chief Inspector',
      "File workmen's compensation claim",
      'Approach NHRC for systemic violations',
    ],
  },
  {
    id: 10,
    category: 'women',
    title: 'Right Against Sexual Harassment at Workplace',
    summary:
      'Protection against sexual harassment at workplace with mandatory complaint mechanism.',
    details:
      'The POSH Act (2013) mandates every organization with 10+ employees to form an Internal Complaints Committee (ICC). Complaints can be filed within 3 months (extendable to 6 months). Employer failure to comply attracts ₹50,000 penalty.',
    articles: [
      'Sexual Harassment of Women at Workplace Act, 2013',
      'Vishaka Guidelines (1997)',
      'Art. 14 & 21 — Equality and Dignified Life',
    ],
    remedies: [
      'File complaint with Internal Complaints Committee (ICC)',
      'Approach Local Complaints Committee (LCC) if ICC absent',
      'File police complaint under IPC Sec 354A',
      'National Commission for Women: ncw.nic.in',
    ],
  },
  {
    id: 11,
    category: 'women',
    title: 'Right Against Domestic Violence',
    summary:
      'Protection from physical, emotional, verbal, sexual, and economic abuse by partners/relatives.',
    details:
      "The Protection of Women from Domestic Violence Act, 2005 provides civil remedies including protection orders, residence orders, monetary relief, and custody orders. You don't need to file for divorce to seek protection.",
    articles: [
      'Protection of Women from DV Act, 2005',
      'IPC Section 498A — Cruelty by husband/relatives',
      'Art. 21 — Right to live with dignity',
    ],
    remedies: [
      'Call Women Helpline: 181 (24x7)',
      'File complaint at nearest police station',
      'Apply for protection order through Protection Officer or Court',
      'File under Section 12 of DV Act in Magistrate court',
    ],
  },
  {
    id: 12,
    category: 'women',
    title: 'Right to Equal Pay',
    summary: 'Women are entitled to equal remuneration for equal work or work of similar nature.',
    details:
      'The Code on Wages, 2019 prohibits gender discrimination in wages and recruitment for the same work or work of similar nature. This applies to all establishments regardless of size.',
    articles: [
      'Code on Wages, 2019 — Section 3',
      'Equal Remuneration Act, 1976 (now subsumed)',
      'Art. 39(d) — Equal pay for equal work (DPSP)',
    ],
    remedies: [
      'File complaint with Labour Commissioner',
      'Approach Labour Court',
      'File writ petition in High Court for government jobs',
    ],
  },
  {
    id: 13,
    category: 'digital',
    title: 'Right to Data Privacy',
    summary:
      'Your personal data cannot be collected, processed, or shared without your informed consent.',
    details:
      'The Digital Personal Data Protection Act, 2023 gives individuals rights over their data including consent management, right to correction, right to erasure, and right to nominate. Data fiduciaries must obtain clear, informed consent.',
    articles: [
      'Digital Personal Data Protection Act, 2023',
      'IT Act, 2000 — Section 43A',
      'K.S. Puttaswamy v. Union of India (2017) — Right to Privacy as Fundamental Right',
    ],
    remedies: [
      'File complaint with Data Protection Board',
      'Withdraw consent from data fiduciaries',
      'Report violations at grievance portal of the organization',
    ],
  },
  {
    id: 14,
    category: 'digital',
    title: 'Right Against Cyber Fraud',
    summary:
      'Legal protection against online fraud, phishing, identity theft, and financial cyber crimes.',
    details:
      'Cyber fraud is punishable under the IT Act with imprisonment up to 3 years and fine up to ₹5 lakh. For financial fraud, banks must credit back unauthorized transactions reported within 3 working days (RBI guidelines).',
    articles: [
      'IT Act, 2000 — Section 66C (Identity Theft), 66D (Cheating)',
      'IPC Section 420 — Cheating',
      'RBI Circular on Limited Liability of Customers',
    ],
    remedies: [
      'Report immediately at cybercrime.gov.in',
      'Call Cyber Helpline: 1930',
      'File complaint at nearest Cyber Crime Police Station',
      'Report to bank within 3 days for zero liability',
    ],
  },
  {
    id: 15,
    category: 'digital',
    title: 'Right Against Online Defamation',
    summary:
      'Protection against false, defamatory content published about you on social media or websites.',
    details:
      'Online defamation is actionable both as a civil wrong (damages) and criminal offense (imprisonment up to 2 years). Intermediaries like social media platforms must take down content within 36 hours of a court order.',
    articles: [
      'IPC Section 499/500 — Defamation',
      'IT Act Section 79 — Intermediary Liability',
      'IT Rules, 2021 — Grievance redressal mechanism',
    ],
    remedies: [
      'Send takedown notice to platform (grievance officer)',
      'File criminal complaint under IPC 500',
      'File civil suit for damages and injunction',
      'Report at cybercrime.gov.in for cyberstalking',
    ],
  },
  {
    id: 16,
    category: 'student',
    title: 'Right to Education',
    summary:
      'Free and compulsory education for every child aged 6-14 years. No child can be denied admission.',
    details:
      'The Right of Children to Free and Compulsory Education Act, 2009 mandates free education in neighborhood schools. Private schools must reserve 25% seats for EWS/disadvantaged groups. No screening procedures or capitation fees allowed for admission.',
    articles: [
      'Art. 21A — Right to Education (Fundamental Right)',
      'RTE Act, 2009',
      '86th Constitutional Amendment',
    ],
    remedies: [
      'Approach School Management Committee',
      'Complain to Block/District Education Officer',
      'File complaint at edudel.nic.in (Delhi) or state portal',
      'Approach National Commission for Protection of Child Rights (NCPCR)',
    ],
  },
  {
    id: 17,
    category: 'student',
    title: 'Right Against Ragging',
    summary:
      'Zero tolerance for ragging in educational institutions with strict criminal penalties.',
    details:
      'Ragging is a criminal offense punishable with imprisonment up to 2 years. Every institution must constitute an Anti-Ragging Committee and an Anti-Ragging Squad. UGC regulations mandate FIR registration for complaints.',
    articles: [
      'UGC Regulations on Curbing Ragging, 2009',
      'Supreme Court directions in Vishwa Jagriti Mission v. CBI (2019)',
      'IPC 340, 342, 506 — Wrongful confinement, Intimidation',
    ],
    remedies: [
      'Call National Anti-Ragging Helpline: 1800-180-5522',
      'File complaint at antiragging.in',
      'File FIR at police station',
      "Complain to institution's Anti-Ragging Committee",
    ],
  },
  {
    id: 18,
    category: 'student',
    title: 'Right to Fair Examination & Evaluation',
    summary:
      'Students have the right to transparent and fair examination, and access to their evaluated answer sheets.',
    details:
      'Under RTI Act, you can access your evaluated answer sheets. Universities must have transparent evaluation criteria. Marks/grades must be communicated within a reasonable time. Arbitrary marking can be challenged.',
    articles: [
      'RTI Act, 2005 — Section 6',
      'CBSE Examination Bye-Laws',
      'Art. 14 — Right to fair treatment',
    ],
    remedies: [
      'File RTI for evaluated answer sheets',
      'Apply for revaluation/rechecking (as per institution rules)',
      'Approach university grievance cell',
      'File writ petition in High Court for arbitrary evaluation',
    ],
  },
];

function RightCard({ right, isExpanded, onToggle }) {
  const categoryObj = CATEGORIES.find((c) => c.id === right.category);
  const CategoryIcon = categoryObj?.icon || Scale;

  return (
    <motion.div
      layout
      className="bg-void rounded border-2 border-white/5 overflow-hidden hover:border-red/40 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] group"
    >
      <button onClick={onToggle} className="w-full text-left p-6 flex items-start gap-5">
        <div className="w-12 h-12 rounded bg-void border-2 border-white/10 flex items-center justify-center flex-shrink-0 mt-1 transition-all group-hover:border-red/40 shadow-inner">
          <CategoryIcon className="w-6 h-6 text-white/40 group-hover:text-red transition-all" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[9px] uppercase tracking-[0.3em] text-red font-extrabold px-3 py-1 bg-red/10 rounded border-2 border-red/20 italic">
              {right.category}
            </span>
          </div>
          <h3 className="text-xl font-display font-bold text-white uppercase tracking-tighter italic leading-tight pr-6">
            {right.title}
          </h3>
          <p className="text-sm text-text-tertiary font-body mt-2 leading-relaxed uppercase tracking-wider italic opacity-80">
            {right.summary}
          </p>
        </div>
        <div
          className={`p-2 rounded border-2 transition-all flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] ${isExpanded ? 'bg-red border-red text-white' : 'bg-void border-white/10 text-white/20'}`}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6 border-t-2 border-white/5 pt-6 ml-16">
              {/* Full Details */}
              <p className="text-[13px] text-text-tertiary leading-relaxed font-body uppercase tracking-wider italic opacity-80">
                {right.details}
              </p>

              {/* Legal References */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-red italic opacity-60">
                  <BookOpen className="w-4 h-4" />
                  STATUTORY_REFERENCE_INDEX
                </label>
                <div className="flex flex-wrap gap-3">
                  {right.articles.map((art, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-4 py-2 bg-void text-white rounded border-2 border-white/10 font-mono tracking-tighter shadow-inner italic"
                    >
                      {art}
                    </span>
                  ))}
                </div>
              </div>

              {/* Remedies */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-[0.4em] text-blue italic opacity-60">
                  <Shield className="w-4 h-4" />
                  OPERATIONAL_REMEDIES
                </label>
                <ul className="grid gap-3">
                  {right.remedies.map((remedy, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[11px] text-text-tertiary font-body uppercase tracking-widest italic bg-void p-3 rounded border-2 border-blue/10 shadow-sm"
                    >
                      <span className="text-blue font-bold">»</span>
                      {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RightsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredRights = useMemo(() => {
    let results = RIGHTS_DATA;
    if (activeCategory !== 'all') {
      results = results.filter((r) => r.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.details.toLowerCase().includes(q) ||
          r.articles.some((a) => a.toLowerCase().includes(q)) ||
          r.remedies.some((rem) => rem.toLowerCase().includes(q)),
      );
    }
    return results;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-void pb-32">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-32 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-red/10 text-red-light text-[10px] uppercase font-extrabold tracking-[0.4em] rounded border-2 border-red/20 shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)] font-display italic">
            <Scale className="w-4 h-4" />
            <span>Rights_Explorer_Terminal</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none italic">
            Know Your <span className="text-red">Rights</span>
          </h1>
          <p className="text-lg text-text-tertiary leading-relaxed max-w-2xl mx-auto font-body uppercase tracking-wider italic">
            Explore your fundamental and statutory mandates under Indian law. Every node includes
            legal reference indices and tactical remedies.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-hover:text-red transition-all" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_RIGHTS_REGISTRY..."
              className="w-full bg-void border-2 border-white/5 rounded px-16 py-5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red/40 transition-all font-display font-bold tracking-widest uppercase italic shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] shadow-inner"
            />
            {searchQuery && (
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-red font-extrabold uppercase tracking-[0.2em] italic">
                {filteredRights.length} HITS
              </span>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count =
              cat.id === 'all'
                ? RIGHTS_DATA.length
                : RIGHTS_DATA.filter((r) => r.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedId(null);
                }}
                className={`flex items-center gap-3 px-5 py-2.5 rounded border-2 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[1px] active:translate-y-[1px] italic ${
                  isActive
                    ? 'bg-red border-red text-white shadow-[6px_6px_0px_0px_rgba(159,18,57,0.3)]'
                    : 'bg-void border-white/10 text-white/40 hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded border ${isActive ? 'bg-void/20 border-white/30 text-white' : 'bg-void border-white/5 text-white/20'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rights Grid */}
        <motion.div layout className="grid gap-4">
          <AnimatePresence>
            {filteredRights.map((right) => (
              <RightCard
                key={right.id}
                right={right}
                isExpanded={expandedId === right.id}
                onToggle={() => setExpandedId(expandedId === right.id ? null : right.id)}
              />
            ))}
          </AnimatePresence>

          {filteredRights.length === 0 && (
            <div className="text-center py-24 bg-void rounded border-2 border-dashed border-white/10 shadow-inner space-y-8">
              <Search className="w-16 h-16 text-white/10 mx-auto" />
              <div className="space-y-2">
                <p className="text-xl font-display font-bold text-white uppercase tracking-tighter italic">
                  ZERO_RESULTS_FETCHED
                </p>
                <p className="text-xs text-text-tertiary uppercase tracking-[0.4em] italic opacity-60">
                  THE REQUESTED RIGHT DOES NOT EXIST IN LOCAL STATUTORY RECORDS.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-8 py-4 rounded border-2 border-white/10 text-white/60 text-[11px] font-extrabold uppercase tracking-widest hover:text-white hover:border-white/30 transition-all italic shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  PURGE_REGISTRY_FILTERS
                </button>
                <button
                  onClick={() =>
                    navigate('/chat', {
                      state: {
                        sampleCase: `What are my legal rights regarding: ${searchQuery}?`,
                        caseType: 'Rights Inquiry',
                      },
                    })
                  }
                  className="px-8 py-4 rounded bg-red text-white text-[11px] font-extrabold uppercase tracking-widest hover:bg-red-dark transition-all flex items-center gap-3 italic shadow-[6px_6px_0px_0px_rgba(159,18,57,0.4)]"
                >
                  <Scale className="w-4 h-4" />
                  CONSULT_AI_ORACLE
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
