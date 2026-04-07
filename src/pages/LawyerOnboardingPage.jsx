import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  ShieldCheck,
  Briefcase,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Award,
  IndianRupee,
  Link as LinkIcon,
  Linkedin,
  Twitter,
  AlertCircle,
  Terminal,
  Zap,
  Plus,
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const STEPS = [
  { id: 1, label: 'PERSONAL_ID', icon: User },
  { id: 2, label: 'VERIFICATION', icon: ShieldCheck },
  { id: 3, label: 'EXPERIENCE_LOG', icon: Award },
  { id: 4, label: 'NETWORK_SYNC', icon: Globe },
];

const SPECIALIZATIONS = [
  'Criminal Law',
  'Civil Law',
  'Family Law',
  'Property Law',
  'Consumer Law',
  'Tax Law',
  'Cyber Law',
  'Constitutional Law',
  'Labour Law',
  'Arbitration',
  'Human Rights',
  'IP Law',
];

const COURTS = [
  'Supreme Court of India',
  'Delhi High Court',
  'Bombay High Court',
  'Madras High Court',
  'Karnataka High Court',
  'District Court',
  'Magistrate Court',
];

export default function LawyerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Delhi',
    regNo: '',
    enrollmentYear: '',
    stateBar: '',
    experience: '',
    cases: '',
    court: 'High Court',
    specializations: [],
    feeRange: '₹50,000 - ₹1,00,000',
    linkedin: '',
    twitter: '',
    website: '',
    bio: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (spec) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-void pb-8 flex flex-col font-mono">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 w-full space-y-12 pb-24">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-void border-2 border-red/40 text-red text-[10px] uppercase font-extrabold tracking-[0.4em] italic rounded-sm shadow-hard-red/10">
            <Terminal className="w-4 h-4" />
            <span>RECRUITMENT_PROTOCOL_ACTIVE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tighter italic">
            BUREAU <span className="text-red">ENROLLMENT</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-xl mx-auto font-body uppercase tracking-[0.2em] italic opacity-60">
            AUTHENTICATE PROFESSIONAL CREDENTIALS. JOIN THE AUTHORITY NETWORK. SECURE DIRECTIVE-GATED LEGAL ASSIGNMENTS.
          </p>
        </div>

        {!isSuccess ? (
          <div className="bg-void border-2 border-white/5 shadow-hard relative overflow-hidden">
             {/* Tactical Grid Background Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            {/* Progress Bar */}
            <div className="bg-void p-10 border-b-2 border-white/5 flex items-center justify-between relative z-10">
              {STEPS.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-4 relative z-10">
                  <div
                    className={`w-14 h-14 rounded-sm flex items-center justify-center transition-all duration-500 border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${
                      currentStep >= step.id
                        ? 'bg-red border-red-light/40 text-white'
                        : 'bg-void border-white/10 text-text-tertiary'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] uppercase font-extrabold tracking-[0.3em] italic ${currentStep >= step.id ? 'text-white' : 'text-text-tertiary opacity-40'}`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
              {/* Connector Lines */}
              <div className="absolute top-[4.5rem] left-[15%] right-[15%] h-[2px] bg-void/5 -z-0 hidden md:block">
                <motion.div
                  className="h-full bg-red shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                  animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12 relative z-10">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="flex flex-col md:flex-row gap-10 items-center border-b-2 border-white/5 pb-12">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-sm bg-void border-2 border-white/10 flex items-center justify-center text-text-tertiary overflow-hidden group-hover:border-red/40 transition-all shadow-hard relative">
                          <Camera className="w-10 h-10 opacity-20" />
                          <div className="absolute inset-0 bg-red/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red rounded-sm flex items-center justify-center text-white cursor-pointer hover:bg-red-dark transition-all border-2 border-red-light/20 shadow-hard-red">
                          <Plus className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-6 w-full">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                              IDENT_NAME_PROTOCOL
                            </label>
                            <input
                              type="text"
                              placeholder="ADV_RAJESH_KUMAR"
                              value={formData.name}
                              onChange={(e) => updateFormData('name', e.target.value)}
                              className="input-field-onboarding uppercase"
                              required
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                              SECURE_COMMS_LINK
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red" />
                              <input
                                type="email"
                                placeholder="CLIENT_STREAM@AUTHORITY.IN"
                                value={formData.email}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                className="input-field-onboarding pl-11"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          VOICE_CHANNEL_ID
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red" />
                          <input
                            type="tel"
                            placeholder="+91_MOBILE_STREAM"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            className="input-field-onboarding pl-11"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          GEOGRAPHIC_SECTOR
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red" />
                          <input
                            type="text"
                            placeholder="NEW_DELHI_HUB"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            className="input-field-onboarding pl-11 uppercase"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="p-6 bg-void border-2 border-red/20 rounded shadow-hard-red flex items-start gap-5 italic relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <ShieldCheck className="w-12 h-12 text-red" />
                      </div>
                      <AlertCircle className="w-6 h-6 text-red shrink-0 mt-1" />
                      <div className="space-y-2">
                         <p className="text-[12px] text-red font-extrabold uppercase tracking-widest">
                           // DATA_VERIFICATION_ADVISORY
                         </p>
                         <p className="text-[10px] text-red-light/60 leading-relaxed font-mono uppercase tracking-wider">
                           CREDENTIALS MATCHED AGAINST BAR COUNCIL OF INDIA REGISTRIES. MOCK ENROLLMENT NUMBERS (E.G. D/422/1986) AUTO-BYPASS FOR DEMO STREAM.
                         </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          BCI_REGISTRATION_ID
                        </label>
                        <input
                          type="text"
                          placeholder="MAH/123/2012"
                          value={formData.regNo}
                          onChange={(e) => updateFormData('regNo', e.target.value)}
                          className="input-field-onboarding uppercase"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          ACTIVATION_YEAR
                        </label>
                        <input
                          type="number"
                          placeholder="20XX"
                          value={formData.enrollmentYear}
                          onChange={(e) => updateFormData('enrollmentYear', e.target.value)}
                          className="input-field-onboarding"
                          required
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          STATE_COUNCIL_NODE
                        </label>
                        <select
                          value={formData.stateBar}
                          onChange={(e) => updateFormData('stateBar', e.target.value)}
                          className="input-field-onboarding bg-void appearance-none uppercase italic"
                        >
                          <option value="">SELECT_COUNCIL_NODE</option>
                          <option value="Delhi">BAR_COUNCIL_OF_DELHI</option>
                          <option value="Mah">BAR_COUNCIL_OF_MAHARASHTRA_GOA</option>
                          <option value="UP">BAR_COUNCIL_OF_UP</option>
                          <option value="Kar">BAR_COUNCIL_OF_KARNATAKA</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          EXPERIENCE_CYCLES
                        </label>
                        <input
                          type="number"
                          placeholder="10+"
                          value={formData.experience}
                          onChange={(e) => updateFormData('experience', e.target.value)}
                          className="input-field-onboarding"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          TOTAL_RESOLUTIONS
                        </label>
                        <input
                          type="number"
                          placeholder="500"
                          value={formData.cases}
                          onChange={(e) => updateFormData('cases', e.target.value)}
                          className="input-field-onboarding"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          PRIMARY_FORUM
                        </label>
                        <select
                          value={formData.court}
                          onChange={(e) => updateFormData('court', e.target.value)}
                          className="input-field-onboarding bg-void appearance-none uppercase italic"
                        >
                          {COURTS.map((c) => (
                            <option key={c} value={c}>
                              {c.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                        STRATUM_SPECIALIZATIONS
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {SPECIALIZATIONS.map((spec) => (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => toggleSpecialization(spec)}
                            className={`px-4 py-2 rounded-sm text-[9px] font-extrabold uppercase tracking-widest transition-all border-2 italic ${
                              formData.specializations.includes(spec)
                                ? 'bg-red text-white border-red-light/40 shadow-hard-red/40'
                                : 'bg-void border-white/5 text-text-tertiary hover:border-red/40 opacity-60'
                            }`}
                          >
                            {spec.replace(' ', '_')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                        RETAINER_STREAM_VALUATION
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red" />
                        <input
                          type="text"
                          placeholder="INR_STREAM_ESTIMATE"
                          value={formData.feeRange}
                          onChange={(e) => updateFormData('feeRange', e.target.value)}
                          className="input-field-onboarding pl-11"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          LINKEDIN_STRATUM_ID
                        </label>
                        <div className="relative">
                          <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red" />
                          <input
                            type="url"
                            placeholder="LINKEDIN_PROF_URL"
                            value={formData.linkedin}
                            onChange={(e) => updateFormData('linkedin', e.target.value)}
                            className="input-field-onboarding pl-11 italic uppercase text-[11px]"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                          X_STREAM_HANDLE
                        </label>
                        <div className="relative">
                          <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red" />
                          <input
                            type="text"
                            placeholder="@HANDLE_ID"
                            value={formData.twitter}
                            onChange={(e) => updateFormData('twitter', e.target.value)}
                            className="input-field-onboarding pl-11 italic uppercase"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-text-tertiary italic">
                        BUREAU_PROFILE_SUMMARY [DECRYPTED]
                      </label>
                      <div className="relative">
                        <textarea
                          rows={5}
                          placeholder="INPUT_PROFESSIONAL_MANIFESTO_HERE..."
                          value={formData.bio}
                          onChange={(e) => updateFormData('bio', e.target.value)}
                          className="w-full bg-void border-2 border-white/5 rounded-sm p-6 text-sm text-white focus:border-red/60 outline-none transition-all placeholder:text-text-tertiary/20 resize-none font-mono uppercase italic tracking-tighter"
                        />
                        <div className="absolute bottom-4 right-4 opacity-5">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-10 border-t-2 border-white/5">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-3 text-text-tertiary font-extrabold text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors italic"
                  >
                    <ArrowLeft className="w-4 h-4" /> // REVERT_HANDSHAKE
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-void border-2 border-white/10 hover:border-red/40 text-white px-10 py-4 rounded-sm font-extrabold text-[10px] uppercase tracking-[0.4em] transition-all flex items-center gap-3 active:translate-y-[1px] italic"
                  >
                    CONTINUE_SYNC <ArrowRight className="w-4 h-4 text-red" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-red hover:bg-red-dark text-white px-12 py-5 rounded-sm font-extrabold text-[11px] uppercase tracking-[0.5em] transition-all shadow-hard-red flex items-center gap-4 active:shadow-none active:translate-y-[2px] italic"
                  >
                    SUBMIT_TO_AUTHORITY <CheckCircle2 className="w-6 h-6" />
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="bg-void border-2 border-red/40 p-16 text-center space-y-10 shadow-hard-red relative overflow-hidden">
               {/* Tactical Grid Background Overlay */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
              
              <div className="w-24 h-24 bg-red/10 border-2 border-red/40 rounded-sm mx-auto flex items-center justify-center relative">
                <CheckCircle2 className="w-12 h-12 text-red" />
                <motion.div 
                  className="absolute inset-0 border-2 border-red rounded-sm"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-display font-bold text-white uppercase tracking-tighter italic">REGISTRATION_COMPLETE</h2>
                <p className="text-xs text-text-tertiary font-mono uppercase tracking-[0.3em] max-w-md mx-auto italic opacity-60">
                  // INITIALIZING_BUREAU_HANDSHAKE... 
                  CREDENTIALS ENQUEUED FOR BCI_DATABASE SYNC [TARGET: 24H].
                </p>
              </div>

              {/* Profile Preview */}
              <div className="bg-void border-2 border-white/5 p-10 max-w-xl mx-auto shadow-hard text-left space-y-8 relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-sm bg-void border-2 border-white/5 flex items-center justify-center text-5xl font-display text-red font-bold italic shadow-hard">
                    {formData.name.split(' ').pop()[0].toUpperCase() || 'A'}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-display font-bold text-white uppercase italic tracking-tight">
                        {formData.name || 'ADV_RAJESH_KUMAR'}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-void border border-red/40 text-red text-[8px] rounded-sm uppercase font-extrabold tracking-[0.2em] italic">
                        SEC_PENDING
                      </div>
                    </div>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-mono italic opacity-60">
                      {formData.court.toUpperCase()} // {formData.city.toUpperCase()}_SECTOR
                    </p>
                    <p className="text-[10px] text-red-light/60 mt-1 font-mono uppercase tracking-[0.2em]">
                      REG_ID: {formData.regNo.toUpperCase() || 'NULL_PTR'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.specializations.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-void/5 border border-white/10 text-[9px] uppercase font-extrabold tracking-widest text-text-tertiary italic"
                    >
                      {s.replace(' ', '_')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => (window.location.href = '/lawyers')}
                  className="text-red font-extrabold uppercase tracking-[0.5em] text-[10px] italic hover:text-white transition-all underline decoration-2 underline-offset-8"
                >
                  // RETURN_TO_REGISTRY_DIRECTORY
                </button>
              </div>
            </div>

            <div className="bg-void border-2 border-blue/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-hard-blue italic">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue/10 border-2 border-blue/40 rounded-sm flex items-center justify-center shadow-hard-blue/20">
                  <Linkedin className="w-8 h-8 text-blue" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-white uppercase tracking-widest italic">STRATUM_BADGE_SYNC</p>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-widest opacity-60 max-w-md font-mono">
                    SHARE_TO_COLLECT "FOUNDING_ADVOCATE" STRATUM_SIGNATURE ON AUTHORITY_CORE.
                  </p>
                </div>
              </div>
              <button className="bg-blue hover:bg-blue-dark text-white px-8 py-3 rounded-sm font-extrabold text-[10px] uppercase tracking-[0.3em] italic shadow-hard-blue active:shadow-none active:translate-y-[2px] transition-all">
                INIT_SHARE
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />

      <style>{`
        .input-field-onboarding {
          width: 100%;
          background: #000000;
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          padding: 1.25rem 1.5rem;
          font-size: 0.75rem;
          color: white;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: 0.1em;
        }
        .input-field-onboarding:focus {
          border-color: rgba(225, 29, 72, 0.6);
          box-shadow: 8px 8px 0px 0px rgba(159, 18, 57, 0.1);
        }
        .input-field-onboarding::placeholder {
          color: rgba(255, 255, 255, 0.1);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
