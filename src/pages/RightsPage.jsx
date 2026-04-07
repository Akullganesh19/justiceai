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
  ArrowRight,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

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
    title: 'Right to Protection Against Hazards',
    summary:
      'Safeguarding against the marketing of goods and services hazardous to life and property.',
    details:
      'Under the Consumer Protection Act, 2019, every consumer possesses the statutory right to be protected against the marketing of goods and services which are hazardous to life and property. Product liability claims can be formally filed against manufacturers, sellers, and service providers for any such violations.',
    articles: [
      'Section 2(9) — Consumer Protection Act, 2019',
      'Article 21 — Fundamental Right to Life and Safety',
    ],
    remedies: [
      'Lodge a formal complaint with the District/State/National Consumer Commission',
      'Initiate product liability proceedings under Chapter VI of the CPA 2019',
      'Seek legal compensation for any injury or material damage sustained',
    ],
  },
  {
    id: 2,
    category: 'consumer',
    title: 'Right to Redressal for Defective Goods',
    summary:
      'Provisions to return defective merchandise and claim a formal refund or replacement.',
    details:
      "Statutory provisions entitle consumers to a replacement, repair, or full consideration refund if a product exhibits manufacturing defects or fails to align with the seller's representations. Procedural filing at the Consumer Forum is streamlined and requires minimal oversight.",
    articles: ['Section 35 — Consumer Protection Act, 2019', 'Section 39 — Statutory Remedies'],
    remedies: [
      'Execute a consumer complaint via the institutional portal: edaakhil.nic.in',
      'Leverage simplified filing procedures; legal counsel is optional for the initial phase',
      'Standard filing fees range from ₹100 to ₹5000 based on claim valuation',
    ],
  },
  {
    id: 3,
    category: 'consumer',
    title: 'Right Against Unfair Trade Practices',
    summary:
      'Legal safeguards against deceptive advertising, misleading representations, and predatory tactics.',
    details:
      'Unfair trade practices encompass false representations regarding quality, misleading digital advertisements, and bait-and-switch strategies. The Central Consumer Protection Authority (CCPA) is mandated to impose stringent penalties on such commercial violations.',
    articles: ['Section 2(47) — Definition of Unfair Trade Practices', 'Section 18 — Statutory Powers of the CCPA'],
    remedies: [
      'Submit a formal grievance to the CCPA through consumerhelpline.gov.in',
      'Initiate proceedings before the competent Consumer Forum',
      'Submit reports regarding misleading advertisements to the ASCI',
    ],
  },
  {
    id: 4,
    category: 'tenant',
    title: 'Right to Security Deposit Restoration',
    summary:
      'Mandatory return of security deposits, subject only to legitimate and documented deductions.',
    details:
      'State-specific Rent Control Acts mandate the restoration of security deposits within a stipulated timeline upon vacating the premises. Deductions are strictly limited to actual structural damage beyond reasonable wear and tear, requiring itemized substantiation.',
    articles: ['State Specific Rent Control Acts', 'Model Tenancy Act, 2021 — Section 11'],
    remedies: [
      'Serve a formal legal notice demanding restoration within 15 days',
      'Initiate a civil suit in the Court of Small Causes',
      'Petition the designated Rent Authority in states where the Model Tenancy Act is adopted',
    ],
  },
  {
    id: 5,
    category: 'tenant',
    title: 'Right Against Arbitrary Eviction',
    summary: 'Procedural safeguards ensuring eviction proceeds only through valid legal grounds and due process.',
    details:
      'Eviction requires the issuance of a formal notice and substantiation of valid legal grounds, such as non-payment or unauthorized subletting. Summary or self-help evictions, including utility disconnection, constitute a violation of tenant rights.',
    articles: [
      'State Rent Control Statutes',
      'Article 21 — Jurisprudential Right to Shelter',
      'Model Tenancy Act, 2021 — Section 22',
    ],
    remedies: [
      'Lodge a police report if extra-judicial eviction is attempted',
      'Petition the Rent Controller or Civil Court for an interim stay of proceedings',
      'Initiate a suit for permanent injunction against the lessor',
    ],
  },
  {
    id: 6,
    category: 'tenant',
    title: 'Right to Essential Services Maintenance',
    summary:
      'Ensuring continued access to electricity, water, and essential utilities regardless of tenancy disputes.',
    details:
      'Disconnecting essential utilities is a punishable offence under state legislation. Lessors are legally obligated to maintain basic services even during active disputes. Affected tenants may seek criminal and civil redressal for such actions.',
    articles: [
      'Section 503/506 IPC — Criminal Intimidation',
      'State Rent Control Acts',
      'Article 21 — Right to Dignified Existence',
    ],
    remedies: [
      'Initiate immediate criminal proceedings via local law enforcement',
      'Petition the Rent Controller for a restoration of services order',
      'Initiate a civil suit seeking a mandatory injunction',
    ],
  },
  {
    id: 7,
    category: 'employee',
    title: 'Right to Minimum Remuneration',
    summary:
      'Statutory entitlement to wages not below the floor limit established by the competent government authority.',
    details:
      'The Code on Wages, 2019, mandates a floor wage threshold. State governments are empowered to establish higher minimum remuneration limits. These provisions apply comprehensively to both scheduled and non-scheduled employment sectors.',
    articles: ['Code on Wages, 2019 — Section 6', 'Article 43 — Directive Principle for Living Wages'],
    remedies: [
      'Submit a formal grievance to the jurisdictional Labour Commissioner',
      'Initiate a formal claim within the Labour Court',
      'Utilize the national Shram Suvidha helpline for reporting violations',
    ],
  },
  {
    id: 8,
    category: 'employee',
    title: 'Right Against Wrongful Termination',
    summary:
      'Procedural requirement for employers to adhere to due process, notice periods, and valid justifications for dismissal.',
    details:
      'Under the Industrial Disputes Act, retrenchment necessitates a mandatory notice period or compensation, valid operational grounds, and adherence to the "last in, first out" principle. Establishments exceeding a specific size require prior governmental authorization.',
    articles: [
      'Industrial Disputes Act, 1947 — Section 25F',
      'Articles 14 and 16 — Constitutional Guarantees of Equality and Opportunity',
    ],
    remedies: [
      'Register a formal dispute with the Labour Commissioner',
      'Approach the competent Labour Court or Industrial Tribunal',
      'Public sector employees may exercise constitutional remedies via Writ Petitions',
    ],
  },
  {
    id: 9,
    category: 'employee',
    title: 'Right to Occupational Safety',
    summary: 'Entitlement to a workplace environment free from recognized hazards and compliant with health standards.',
    details:
      'The Occupational Safety, Health and Working Conditions Code, 2020, stipulates rigorous standards for workplace environments. Employers are legally obligated to provide protective equipment, training, and regular health assessments. Non-compliance invites penal consequences.',
    articles: [
      'OSH Code, 2020 — Chapters III & IV',
      'Article 21 — Jurisprudential Right to Healthy Working Conditions',
      'Factories Act, 1948 — Sections 11-20',
    ],
    remedies: [
      'Report environmental violations to the Factory Inspectorate',
      "Initiate a claim for compensation under the Workmen's Compensation framework",
      'Petition the National Human Rights Commission (NHRC) for systemic failures',
    ],
  },
  {
    id: 10,
    category: 'women',
    title: 'Right Against Workplace Sexual Harassment',
    summary:
      'Constitutional protection against harassment with mandatory internal grievance mechanisms.',
    details:
      'The POSH Act (2013) mandates the constitution of an Internal Complaints Committee (ICC) in organizations exceeding ten employees. Violations and failures to implement these mechanisms attract significant statutory penalties.',
    articles: [
      'Workplace Protection (Sexual Harassment) Act, 2013',
      'Vishaka Guidelines (1997)',
      'Articles 14 and 21 — Fundamental Rights to Equality and Dignity',
    ],
    remedies: [
      'Submit a formal complaint to the Internal Complaints Committee (ICC)',
      'Approach the Local Complaints Committee (LCC) if the ICC is not constituted',
      'Register a criminal complaint under Section 354A of the IPC/BNS',
      'Utilize the National Commission for Women (NCW) grievance portal',
    ],
  },
  {
    id: 11,
    category: 'women',
    title: 'Right Against Domestic Violence',
    summary:
      'Safeguards against physical, emotional, and economic abuse within domestic relationships.',
    details:
      "The Protection of Women from Domestic Violence Act, 2005, provides comprehensive civil remedies, including protection and residence orders. These legal provisions are independent of matrimonial proceedings.",
    articles: [
      'Domestic Violence Protection Act, 2005',
      'IPC Section 498A — Provisions regarding matrimonial cruelty',
      'Article 21 — Right to an Existence with Dignity',
    ],
    remedies: [
      'Contact the national women’s helpline at 181 for immediate assistance',
      'Register a formal complaint at the nearest police station',
      'Petition the Magistrate for immediate protection and maintenance orders',
      'Engage the services of the designated Protection Officer',
    ],
  },
  {
    id: 12,
    category: 'women',
    title: 'Right to Equal Remuneration',
    summary: 'Entitlement to parity in wages for work of identical or similar nature across all sectors.',
    details:
      'The Code on Wages, 2019, strictly prohibits gender-based discrimination in remuneration and recruitment processes for identical work. These statutory obligations apply universally across all employment establishments.',
    articles: [
      'Code on Wages, 2019 — Section 3',
      'Equal Remuneration Act (subsumed)',
      'Article 39(d) — Directive Principle for Equal Pay for Equal Work',
    ],
    remedies: [
      'Formalize a grievance with the Labour Commissionerate',
      'Seek adjudication through the Labour Court',
      'Public sector employees may petition the High Court for systemic wage disparity',
    ],
  },
  {
    id: 13,
    category: 'digital',
    title: 'Right to Digital Privacy',
    summary:
      'Statutory protection over personal data, requiring informed consent for collection and processing.',
    details:
      'The Digital Personal Data Protection Act, 2023, grants individuals comprehensive rights over their data, including the right to correction and erasure. Data fiduciaries are legally required to obtain explicit, informed consent.',
    articles: [
      'Digital Personal Data Protection Act, 2023',
      'Information Technology Act — Section 43A',
      'Puttaswamy Judgment (SC) — Declaring Privacy as a Fundamental Right',
    ],
    remedies: [
      'Lodge a formal complaint with the Data Protection Board',
      'Exercise the right to withdraw consent from data fiduciaries',
      'Utilize institutional grievance redressal mechanisms for data violations',
    ],
  },
  {
    id: 14,
    category: 'digital',
    title: 'Protection Against Cyber Fraud',
    summary:
      'Safeguards against online deception, phishing, and unauthorized financial transactions.',
    details:
      'Cyber fraud is a criminal offence punishable under the IT Act. RBI guidelines provide for limited liability of customers in cases of unauthorized transactions when reported within specified timelines.',
    articles: [
      'IT Act — Section 66C and 66D',
      'Section 420 IPC — Cheating/Fraud',
      'RBI Guidelines on Limited Customer Liability',
    ],
    remedies: [
      'Immediate reporting via the national portal: cybercrime.gov.in',
      'Utilization of the Cyber Helpline: 1930',
      'Filing a formal report at the nearest Cyber Crime Cell',
      'Notifying the financial institution within 72 hours for liability protection',
    ],
  },
  {
    id: 15,
    category: 'digital',
    title: 'Right Against Online Defamation',
    summary:
      'Legal protection against the publication of false and injurious content on digital platforms.',
    details:
      'Digital defamation constitutes both a civil tort and a criminal offence. Intermediaries are legally obligated to remove defamatory content upon receipt of a judicial or government order.',
    articles: [
      'IPC Section 499/500 — Defamation',
      'IT Act Section 79 — Provisions for Intermediary Liability',
      'Information Technology (Intermediary Guidelines) Rules, 2021',
    ],
    remedies: [
      'Serve a takedown notice to the platform’s Grievance Officer',
      'Initiate criminal proceedings for defamation',
      'File a civil suit for damages and mandatory take-down injunctions',
      'Report incidents of cyberstalking via official channels',
    ],
  },
  {
    id: 16,
    category: 'student',
    title: 'Right to Compulsory Education',
    summary:
      'Fundamental right to free and mandatory education for children between the ages of 6 and 14.',
    details:
      'The RTE Act, 2009, mandates the provision of free education in local government-funded schools. Private institutions are obligated to reserve seats for disadvantaged sections under statutory requirements.',
    articles: [
      'Article 21A — Primary Fundamental Right to Education',
      'RTE Act, 2009',
      '86th Constitutional Amendment Act',
    ],
    remedies: [
      'Engage with the School Management Committee for grievances',
      'Report violations to the District Education Officer (DEO)',
      'Submit formal complaints via state education portals',
      'Petition the NCPCR for systemic denial of educational rights',
    ],
  },
  {
    id: 17,
    category: 'student',
    title: 'Statutory Protection Against Ragging',
    summary:
      'Zero-tolerance policy regarding physical or psychological abuse in educational institutions.',
    details:
      'Ragging is a criminal offence with substantial penal consequences. Educational institutions are statutorily required to maintain Anti-Ragging Committees. UGC regulations mandate immediate FIR registration for documented incidents.',
    articles: [
      'UGC Regulations on Curbing Ragging in Higher Education',
      'Supreme Court Directives (Aman Kachroo Case)',
      'IPC Provisions for Wrongful Confinement and Intimidation',
    ],
    remedies: [
      'Contact the National Anti-Ragging Helpline at 1800-180-5522',
      'Register a digital complaint via antiragging.in',
      'Lodge a First Information Report (FIR) at the local police station',
      'Formally notify the institution’s disciplinary committee',
    ],
  },
  {
    id: 18,
    category: 'student',
    title: 'Right to Fair Academic Evaluation',
    summary:
      'Entitlement to transparency in examination processes and access to evaluated academic records.',
    details:
      'Under RTI provisions, students are entitled to access their evaluated answer scripts. Institutions must maintain transparent evaluation criteria and communicate academic results within reasonable timeframes.',
    articles: [
      'RTI Act, 2005 — Provisions regarding Access to Information',
      'Institutional Examination Bye-Laws',
      'Article 14 — Right to Fair and Non-Arbitrary Treatment',
    ],
    remedies: [
      'File an RTI application for access to evaluated answer scripts',
      'Apply for formal re-evaluation under institutional regulations',
      'Petition the institutional grievance cell for marking discrepancies',
      'High Court intervention via Writ Jurisdiction for arbitrary failures',
    ],
  },
];

function RightCard({ right, isExpanded, onToggle }) {
  const categoryObj = CATEGORIES.find((c) => c.id === right.category);
  const CategoryIcon = categoryObj?.icon || Scale;

  return (
    <motion.div
      layout
      className="bg-void rounded-sm border-2 border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-300 shadow-hard group"
    >
      <button onClick={onToggle} className="w-full text-left p-8 flex items-start gap-6">
        <div className="w-14 h-14 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center flex-shrink-0 mt-1 transition-all group-hover:border-gold shadow-hard">          <CategoryIcon className="w-7 h-7 text-white/40 group-hover:text-gold transition-all" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] uppercase tracking-widest text-gold font-extrabold px-4 py-1.5 bg-gold/5 rounded-sm border-2 border-gold/20 italic shadow-hard">
              {right.category}
            </span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white tracking-tight leading-none pr-8 group-hover:text-gold transition-colors uppercase italic">
            {right.title}
          </h3>
          <p className="text-[14px] text-text-tertiary font-body mt-3 leading-relaxed opacity-60">
            {right.summary}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-sm border-2 transition-all flex-shrink-0 flex items-center justify-center shadow-hard ${isExpanded ? 'bg-gold border-gold text-midnight' : 'bg-void border-white/10 text-white/20'}`}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
            <div className="px-8 pb-10 space-y-10 border-t border-white/5 pt-10 ml-0 md:ml-20">
              {/* Full Details */}
              <p className="text-[15px] text-text-tertiary leading-relaxed font-body opacity-80 border-l border-gold/20 pl-6 italic">
                {right.details}
              </p>

              {/* Legal References */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-gold opacity-60">
                  <BookOpen className="w-4 h-4" />
                  Statutory Reference Indices
                </label>
                <div className="flex flex-wrap gap-4">
                  {right.articles.map((art, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-5 py-2.5 bg-void text-white rounded-sm border-2 border-white/10 font-extrabold tracking-widest shadow-hard italic"
                    >
                      {art}
                    </span>
                  ))}
                </div>
              </div>

              {/* Remedies */}
              <div className="space-y-6">
                <label className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-widest text-gold opacity-60">
                  <Shield className="w-4 h-4" />
                  Institutional Remedies
                </label>
                <ul className="grid gap-4">
                  {right.remedies.map((remedy, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 text-[13px] text-text-tertiary font-body bg-void p-5 rounded-sm border-2 border-gold/10 shadow-hard italic"
                    >
                      <ArrowRight className="w-4 h-4 text-gold shrink-0 mt-0.5" />
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
    <div className="min-h-screen bg-void pb-32 font-mono text-slate-200">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-32 space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[10px] uppercase font-extrabold tracking-[0.5em] italic rounded-sm shadow-luxe font-display">
            <Scale className="w-5 h-5" />
            <span>REGULATORY_DATABASE_V4.2</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter leading-none text-white italic">
            STATUTORY <span className="text-gold">PROTECTIONS</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.3em] font-mono italic opacity-40">
            EXPLORE YOUR FUNDAMENTAL AND STATUTORY PROTECTIONS UNDER THE INDIAN CONSTITUTION. EACH SECTION INCLUDES STATUTORY REFERENCES AND INSTITUTIONAL REMEDIES.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-hover:text-gold transition-all" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_STATUTORY_PROTECTIONS..."
              className="w-full bg-void border-2 border-white/5 rounded-sm px-16 py-6 text-[14px] font-extrabold text-white placeholder:text-white/10 focus:outline-none focus:border-gold/40 transition-all shadow-hard italic uppercase tracking-widest"
            />
            {searchQuery && (
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-gold font-bold uppercase tracking-widest">
                {filteredRights.length} Matches
              </span>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-4 no-scrollbar">
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
                className={`flex items-center gap-3 px-6 py-3 rounded-sm border-2 text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-luxe active:translate-y-[2px] italic ${
                  isActive
                    ? 'bg-gold border-gold text-midnight shadow-luxe'
                    : 'bg-void border-white/5 text-text-tertiary hover:text-white hover:border-gold/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-sm border ${isActive ? 'bg-midnight/20 border-midnight/20 text-midnight' : 'bg-white/5 border-white/5 text-white/20'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rights Grid */}
        <motion.div layout className="grid gap-6">
          <AnimatePresence mode="popLayout">
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
            <div className="text-center py-24 space-y-10 bg-void rounded-sm border-2 border-dashed border-white/10 shadow-hard">
              <Search className="w-16 h-16 text-white/10 mx-auto" />
              <div className="space-y-4">
                <p className="text-3xl font-display font-bold text-white uppercase tracking-tight">
                  No Results Found
                </p>
                <p className="text-xs text-text-tertiary/40 max-w-lg mx-auto leading-relaxed">
                  No statutory records found matching your search. Try adjusting the filters or consult our AI advisor for specific clarification.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-10 py-4 rounded-sm border-2 border-white/10 text-text-tertiary text-[11px] font-extrabold uppercase tracking-widest hover:text-white hover:border-gold/30 transition-all shadow-hard italic"
                >
                  Clear Filters
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
                  className="px-10 py-4 rounded-sm bg-gold text-midnight text-[11px] font-extrabold uppercase tracking-widest hover:bg-gold-light transition-all flex items-center gap-3 shadow-hard italic"
                >
                  <Scale className="w-5 h-5" />
                  Ask the AI_STATUTORY_CO_PILOT
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
