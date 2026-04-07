import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Briefcase,
  Star,
  Phone,
  Mail,
  IndianRupee,
  Filter,
  ChevronDown,
  UserCheck,
  Award,
  Clock,
  Info,
  ExternalLink,
  UserPlus,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const SPECIALIZATIONS = [
  { id: 'all', label: 'All Specializations' },
  { id: 'consumer', label: 'Consumer Law' },
  { id: 'criminal', label: 'Criminal Law' },
  { id: 'civil', label: 'Civil Law' },
  { id: 'family', label: 'Family / Divorce' },
  { id: 'property', label: 'Property / Real Estate' },
  { id: 'labour', label: 'Labour / Employment' },
  { id: 'cyber', label: 'Cyber / IT Law' },
  { id: 'tax', label: 'Tax Law' },
  { id: 'constitutional', label: 'Constitutional Law' },
];

const CITIES = [
  { id: 'all', label: 'All Cities' },
  { id: 'delhi', label: 'New Delhi' },
  { id: 'mumbai', label: 'Mumbai' },
  { id: 'bangalore', label: 'Bangalore' },
  { id: 'chennai', label: 'Chennai' },
  { id: 'hyderabad', label: 'Hyderabad' },
  { id: 'kolkata', label: 'Kolkata' },
  { id: 'pune', label: 'Pune' },
  { id: 'jaipur', label: 'Jaipur' },
  { id: 'lucknow', label: 'Lucknow' },
];

const LAWYERS_DATA = [
  {
    id: 1,
    name: 'Adv. Harish K. Salve',
    city: 'delhi',
    specialization: 'constitutional',
    experience: 38,
    rating: 5.0,
    cases: 1450,
    fee: '₹3,00,000 - ₹5,00,000',
    phone: '+91 98110 45291',
    email: 'office@hsalve.legal',
    languages: ['English', 'Hindi', 'French'],
    court: 'Supreme Court of India',
    regNo: 'D/422/1986',
    verified: true,
  },
  {
    id: 2,
    name: 'Adv. Mukul Rohatgi',
    city: 'delhi',
    specialization: 'criminal',
    experience: 35,
    rating: 4.9,
    cases: 1200,
    fee: '₹2,50,000 - ₹4,50,000',
    phone: '+91 99100 83921',
    email: 'rohatgi.chambers@legal.in',
    languages: ['English', 'Hindi'],
    court: 'Supreme Court of India',
    regNo: 'D/215/1978',
    verified: true,
  },
  {
    id: 3,
    name: 'Adv. Soumitra Chatterjee',
    city: 'kolkata',
    specialization: 'tax',
    experience: 24,
    rating: 4.8,
    cases: 620,
    fee: '₹35,000 - ₹85,000',
    phone: '+91 98310 12455',
    email: 'soumitra.taxlaw@calhighcourt.in',
    languages: ['Bengali', 'English', 'Hindi'],
    court: 'Calcutta High Court',
    regNo: 'WB/1432/2000',
    verified: true,
  },
  {
    id: 4,
    name: 'Adv. Siddharth Deshmukh',
    city: 'mumbai',
    specialization: 'criminal',
    experience: 19,
    rating: 4.8,
    cases: 540,
    fee: '₹1,20,000 - ₹3,00,000',
    phone: '+91 98200 12845',
    email: 'siddharth@mumbailegal.com',
    languages: ['Marathi', 'English', 'Hindi'],
    court: 'Bombay High Court',
    regNo: 'MAH/2105/2005',
    verified: true,
  },
  {
    id: 5,
    name: 'Adv. K. Ramaswamy',
    city: 'chennai',
    specialization: 'civil',
    experience: 22,
    rating: 4.7,
    cases: 710,
    fee: '₹1,50,000 - ₹3,50,000',
    phone: '+91 98400 93821',
    email: 'ramaswamy.associates@chennai.in',
    languages: ['Tamil', 'English'],
    court: 'Madras High Court',
    regNo: 'TN/5432/2002',
    verified: true,
  },
  {
    id: 6,
    name: 'Adv. Nikhita Rao',
    city: 'bangalore',
    specialization: 'cyber',
    experience: 11,
    rating: 4.7,
    cases: 280,
    fee: '₹80,000 - ₹2,00,000',
    phone: '+91 98112 55823',
    email: 'rao.cyber@blr-law.in',
    languages: ['Kannada', 'English', 'Hindi'],
    court: 'Karnataka High Court',
    regNo: 'KAR/3211/2013',
    verified: true,
  },
  {
    id: 7,
    name: 'Adv. Meera Shekhawat',
    city: 'jaipur',
    specialization: 'property',
    experience: 15,
    rating: 4.6,
    cases: 410,
    fee: '₹45,000 - ₹1,20,000',
    phone: '+91 94140 28311',
    email: 'meera.shekhawat@rajasthanlaw.in',
    languages: ['Hindi', 'English', 'Rajasthani'],
    court: 'Rajasthan High Court',
    regNo: 'RAJ/4221/2009',
    verified: true,
  },
  {
    id: 8,
    name: 'Adv. Rohan Gokhale',
    city: 'pune',
    specialization: 'consumer',
    experience: 8,
    rating: 4.5,
    cases: 145,
    fee: '₹25,000 - ₹60,000',
    phone: '+91 95270 19283',
    email: 'gokhale.pune@legal.co',
    languages: ['Marathi', 'Hindi', 'English'],
    court: 'Pune District Court',
    regNo: 'MAH/5621/2016',
    verified: true,
  },
  {
    id: 9,
    name: 'Adv. Tariq Mansoor',
    city: 'lucknow',
    specialization: 'family',
    experience: 14,
    rating: 4.4,
    cases: 310,
    fee: '₹30,000 - ₹75,000',
    phone: '+91 94150 48291',
    email: 'mansoor.familylaw@up-law.in',
    languages: ['Hindi', 'Urdu', 'English'],
    court: 'Allahabad High Court',
    regNo: 'UP/3112/2010',
    verified: true,
  },
  {
    id: 10,
    name: 'Adv. Shalini Kapoor',
    city: 'delhi',
    specialization: 'labour',
    experience: 28,
    rating: 4.9,
    cases: 850,
    fee: '₹1,50,000 - ₹4,00,000',
    phone: '+91 98100 29384',
    email: 'kapoor.legal@delhi.pro',
    languages: ['Hindi', 'English', 'Punjabi'],
    court: 'Delhi High Court',
    regNo: 'D/842/1996',
    verified: true,
  },
];

function LawyerCard({ lawyer, index }) {
  const [expanded, setExpanded] = useState(false);
  const specLabel =
    SPECIALIZATIONS.find((s) => s.id === lawyer.specialization)?.label || lawyer.specialization;
  const cityLabel = CITIES.find((c) => c.id === lawyer.city)?.label || lawyer.city;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-void rounded border-2 border-white/5 hover:border-red/40 transition-all duration-300 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] group"
    >
      <div className="p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded bg-void border-2 border-white/10 flex items-center justify-center text-3xl font-display text-white font-bold group-hover:border-red/40 transition-all shadow-inner italic">
              {lawyer.name.split(' ').pop()[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-tighter italic leading-tight group-hover:text-red transition-colors">{lawyer.name}</h3>
              </div>
              <p className="text-[10px] text-text-tertiary font-mono uppercase tracking-widest mt-1 opacity-60 italic">
                {lawyer.court.toUpperCase()} // REG_NO: {lawyer.regNo}
              </p>
              {lawyer.verified && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red/10 border-2 border-red/20 rounded mt-3 italic">
                  <UserCheck className="w-4 h-4 text-red" />
                  <span className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-red">
                    BAR_COUNCIL_VERIFIED
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-void rounded border-2 border-white/10 shadow-sm">
            <Star className="w-4 h-4 text-red fill-red" />
            <span className="text-sm font-display font-bold text-white italic">{lawyer.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 border-white/5 bg-void text-[10px] uppercase font-extrabold tracking-widest text-text-tertiary italic hover:border-red/20 transition-colors">
            <Briefcase className="w-3.5 h-3.5 text-red" /> {specLabel.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 border-white/5 bg-void text-[10px] uppercase font-extrabold tracking-widest text-text-tertiary italic hover:border-red/20 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-red" /> {cityLabel.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 border-white/5 bg-void text-[10px] uppercase font-extrabold tracking-widest text-text-tertiary italic hover:border-red/20 transition-colors">
            <Clock className="w-3.5 h-3.5 text-red" /> {lawyer.experience}_YRS_EXP
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 border-white/5 bg-void text-[10px] uppercase font-extrabold tracking-widest text-text-tertiary italic hover:border-red/20 transition-colors">
            <Award className="w-3.5 h-3.5 text-red" /> {lawyer.cases}_DEPLOYS
          </span>
        </div>

        <div className="flex items-center justify-between border-y-2 border-white/5 py-4 my-2">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] italic text-text-tertiary group relative">
            <IndianRupee className="w-4 h-4 text-red" />
            <span>
              {lawyer.fee} <span className="opacity-40 italic">/ CASE_VALUATION</span>
            </span>
            <div className="relative">
              <Info className="w-4 h-4 text-white/10 hover:text-red cursor-help transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-void border-2 border-white/10 rounded shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none text-center">
                <p className="text-[10px] text-text-tertiary uppercase tracking-widest leading-relaxed italic">
                  // DEPLOYMENT_FEE_ESTIMATES_VARY_BY_COMPLEXITY_PROTOCOL
                </p>
              </div>
            </div>
          </div>
          <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue italic">
             {lawyer.languages.join(' • ').toUpperCase()}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded border-2 text-[10px] font-extrabold uppercase tracking-[0.4em] italic transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[1px] active:translate-y-[1px] ${expanded ? 'bg-red border-red text-white' : 'bg-void border-white/5 text-text-tertiary hover:text-white hover:border-white/20'}`}
        >
          <span>{expanded ? 'SECURE_CONTACT_STREAM' : 'ESTABLISH_COMM_LINK'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-4 border-t-2 border-white/5 flex flex-col gap-4">
                <a
                  href={`tel:${lawyer.phone}`}
                  className="flex items-center gap-4 text-xs font-mono font-bold text-text-tertiary hover:text-red transition-colors group/link"
                >
                  <div className="p-2 bg-void border-2 border-white/5 rounded group-hover/link:border-red/40 transition-all">
                    <Phone className="w-4 h-4 text-red" />
                  </div>
                  {lawyer.phone}
                </a>
                <a
                  href={`mailto:${lawyer.email}`}
                  className="flex items-center gap-4 text-xs font-mono font-bold text-text-tertiary hover:text-red transition-colors group/link"
                >
                  <div className="p-2 bg-void border-2 border-white/5 rounded group-hover/link:border-red/40 transition-all">
                    <Mail className="w-4 h-4 text-red" />
                  </div>
                  {lawyer.email.toUpperCase()}
                </a>

                <a
                  href="http://www.barcouncilofindia.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-max items-center gap-3 px-5 py-2.5 rounded bg-void border-2 border-red/20 text-red text-[9px] uppercase font-extrabold tracking-widest hover:bg-red hover:text-white transition-all italic shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  VERIFY_B_C_I_CREDENTIALS
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LawyerFinderPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const filteredLawyers = useMemo(() => {
    let results = LAWYERS_DATA;
    if (selectedSpec !== 'all') results = results.filter((l) => l.specialization === selectedSpec);
    if (selectedCity !== 'all') results = results.filter((l) => l.city === selectedCity);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.languages.some((lang) => lang.toLowerCase().includes(q)),
      );
    }
    if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'experience') results.sort((a, b) => b.experience - a.experience);
    else if (sortBy === 'cases') results.sort((a, b) => b.cases - a.cases);
    return results;
  }, [searchQuery, selectedSpec, selectedCity, sortBy]);

  return (
    <div className="min-h-screen bg-void pb-16 font-mono">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 space-y-12 pb-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 text-center md:text-left">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-4 px-5 py-2 bg-void border-2 border-red/40 text-red text-[11px] uppercase font-extrabold tracking-[0.5em] italic rounded-sm shadow-hard-red/10">
              <UserCheck className="w-5 h-5" />
              <span>LAWYER_DIRECTIVE_REGISTRY_V4.2</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter leading-none italic text-white">
              LOCATE <span className="text-red">ADVOCATE</span>
            </h1>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-xl mx-auto md:mx-0 uppercase tracking-[0.3em] italic opacity-60">
              ACCESS THE VALIDATED DEPLOYMENT HUB FOR INDIAN STATUTORY ADVOCATES. FILTER BY JURISDICTION_ID, SPECIALIZATION_INDEX, AND EXPERIENCE_CYCLE_MANDATE.
            </p>
          </div>

          <div className="pb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/lawyer-onboarding')}
              className="bg-red hover:bg-red-dark text-white px-10 py-6 rounded-sm border-2 border-red-light/20 font-extrabold flex items-center gap-6 shadow-hard-red transition-all font-display group italic hover:shadow-hard active:translate-y-[2px]"
            >
              <div className="p-4 bg-void/20 rounded-sm border-2 border-white/10 group-hover:bg-void/40 transition-colors">
                <UserPlus className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.4em] font-extrabold opacity-60 leading-none mb-1">
                  OFFICER_RECRUITMENT
                </p>
                <p className="text-xl uppercase tracking-tighter italic">JOIN_THE_BUREAU</p>
              </div>
              <ArrowRight className="w-6 h-6 ml-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </div>
        </div>

        <div className="bg-red/[0.03] border-2 border-red/20 rounded-sm px-6 py-4 flex items-center justify-center text-center -mt-4 shadow-inner">
          <p className="text-[11px] text-text-tertiary font-body uppercase tracking-[0.4em] italic leading-relaxed">
            <span className="text-red font-bold mr-3 underline decoration-dotted">// SYSTEM_NOTE:</span>
            PROFILES ARE REPRESENTATIVE VECTORS. JUSTICEAI DOES NOT ENDORSE SPECIFIC ADVOCATE_NODES.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="relative md:col-span-2 group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-white/10 group-hover:text-red transition-all" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_REGISTRY_DATABASE..."
              className="w-full bg-void border-2 border-white/5 rounded-sm px-20 py-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-red/40 transition-all font-display font-bold tracking-[0.4em] uppercase italic shadow-hard shadow-inner"
            />
          </div>
          <div className="relative group">
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="w-full bg-void border-2 border-white/5 rounded-sm px-8 py-6 text-[10px] font-extrabold uppercase tracking-widest text-white/40 focus:outline-none focus:border-red/40 transition-all font-display italic appearance-none cursor-pointer shadow-hard"
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s.id} value={s.id} className="bg-void text-white">
                  {s.label.toUpperCase()}
                </option>
              ))}
            </select>
             <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none group-hover:text-red transition-colors" />
          </div>
          <div className="relative group">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-void border-2 border-white/5 rounded-sm px-8 py-6 text-[10px] font-extrabold uppercase tracking-widest text-white/40 focus:outline-none focus:border-red/40 transition-all font-display italic appearance-none cursor-pointer shadow-hard"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-void text-white">
                  {c.label.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none group-hover:text-red transition-colors" />
          </div>
        </div>

        <div className="flex items-center justify-between border-b-2 border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-red animate-pulse rounded-full shadow-hard-red/40" />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.5em] italic text-text-tertiary">
              <span className="text-red font-bold">{filteredLawyers.length}</span> BUREAU_OFFICERS_ONLINE_SYNC
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Filter className="w-5 h-5 text-text-tertiary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-void border-2 border-white/5 rounded-sm px-6 py-3 text-[9px] font-extrabold text-red uppercase tracking-[0.4em] italic focus:outline-none focus:border-red/50 shadow-hard hover:border-red/20 transition-all cursor-pointer"
            >
              <option value="rating">OPERATIONAL_RATING</option>
              <option value="experience">SENIORITY_LOG_CYCLE</option>
              <option value="cases">DEPLOYMENT_COUNT_SYNC</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredLawyers.map((lawyer, i) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} index={i} />
          ))}
        </div>

        {filteredLawyers.length === 0 && (
          <div className="text-center py-32 bg-void rounded-sm border-2 border-dashed border-white/10 shadow-inner space-y-10 italic">
            <Search className="w-20 h-20 text-white/10 mx-auto" />
            <div className="space-y-4">
              <p className="text-3xl font-display font-bold text-white uppercase tracking-tighter leading-none italic">NULL_SET_DETECTED</p>
              <p className="text-[10px] text-text-tertiary uppercase tracking-[0.5em] italic opacity-40 max-w-lg mx-auto">
                 NO BUREAU_OFFICERS MATCH THE REQUESTED PARAMETERS IN ACTIVE REGISTRY_STRATA.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpec('all');
                setSelectedCity('all');
              }}
              className="px-14 py-5 rounded-sm border-2 border-white/10 text-white/60 text-[10px] font-extrabold uppercase tracking-[0.4em] hover:text-white hover:border-white/30 transition-all italic shadow-hard active:translate-y-[2px]"
            >
              PURGE_REGISTRY_FILTERS_ID
            </button>
          </div>
        )}

        <div className="p-10 bg-void border-2 border-red/[0.15] rounded-sm shadow-hard relative overflow-hidden group/disclaimer hover:border-red/40 transition-all">
          {/* Tactical Grid Background Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-red/5 -mr-24 -mt-24 rotate-45 group-hover/disclaimer:bg-red/10 transition-all pointer-events-none border border-red/10" />
          <div className="flex items-start gap-6 mb-8 relative z-10">
             <AlertCircle className="w-8 h-8 text-red mt-1" />
             <div className="space-y-2">
               <p className="text-[14px] text-red font-extrabold uppercase tracking-[0.5em] font-display italic">
                DIRECTORY_OPERATIONAL_DISCLAIMER_NOTICE_MANDATE
              </p>
              <p className="text-[10px] text-text-tertiary uppercase tracking-[0.3em] font-bold italic opacity-40">
                PROTOCOL_REF: BCI_COMPLIANCE_ALPHA_4.2
              </p>
             </div>
          </div>
          <div className="space-y-6 relative z-10">
            <p className="text-[10px] text-text-tertiary uppercase tracking-[0.4em] font-bold leading-relaxed italic opacity-80 border-l-2 border-red/20 pl-6">
              // BUREAU_PROFILES_INDICATIVE_ONLY. MANDATORY_CREDENTIAL_VERIFICATION_REQUIRED_VIA_BAR_COUNCIL_API_PROTOCOLS. DO NOT INITIALIZE RETAINER_AGREEMENT WITHOUT DIRECT JURISDICTIONAL VALIDATION.
            </p>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 pt-10 border-t-2 border-white/5">
              <p className="text-[10px] text-text-tertiary/40 font-body italic uppercase tracking-widest leading-loose max-w-2xl">
                The indices displayed are industrial-grade mockup deployments for operational demonstration.
                JusticeAI aims to expand deep-tier Bar Council API integration in future development cycles.
                Registry data updated via periodic analytical crawl.
              </p>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-[10px] text-white/10 uppercase tracking-[0.6em] font-extrabold italic">
                  REGISTRY_INDEX_V.4.2.0
                </p>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red shadow-hard-red/40" />
                   <p className="text-[11px] text-red-light font-bold uppercase tracking-[0.3em] italic">
                    LAST_VAL_AUDIT: APR_2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
