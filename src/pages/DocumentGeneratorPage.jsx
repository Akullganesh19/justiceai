import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Download,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Eye,
  Save,
  Send,
  Clock,
  Users,
  IndianRupee,
  MapPin,
  Calendar,
  FileCheck,
  Shield,
  AlertTriangle,
  FileInput,
  Milestone,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

// Document templates
const DOCUMENT_TEMPLATES = {
  legal_notice: {
    id: 'legal_notice',
    name: 'STATUTORY_DEMAND_NOTICE',
    description: 'Formal notification issued prior to initiating legal proceedings.',
    icon: FileCheck,
    category: 'General',
    fields: [
      { id: 'sender_name', label: 'Sender Full Name', type: 'text', placeholder: 'Enter your full legal name' },
      {
        id: 'sender_address',
        label: 'Sender Address',
        type: 'textarea',
        placeholder: 'Complete residential or office address',
      },
      {
        id: 'recipient_name',
        label: 'Recipient Name',
        type: 'text',
        placeholder: 'Name of individual or organization',
      },
      {
        id: 'recipient_address',
        label: 'Recipient Address',
        type: 'textarea',
        placeholder: 'Complete service address',
      },
      { id: 'notice_date', label: 'Date of Notice', type: 'date' },
      { id: 'subject', label: 'Subject Matter', type: 'text', placeholder: 'Brief subject of the notice' },
      {
        id: 'facts',
        label: 'Statement of Facts',
        type: 'textarea',
        placeholder: 'Detailed chronological account of events',
      },
      {
        id: 'relief',
        label: 'Relief Sought',
        type: 'textarea',
        placeholder: 'Specify the specific actions or compensation required',
      },
      {
        id: 'timeline',
        label: 'Compliance Period',
        type: 'text',
        placeholder: 'e.g., 15 days, 30 days',
      },
    ],
    generate: (data) =>
      `LEGAL NOTICE\n\nFrom:\n${data.sender_name}\n${data.sender_address}\n\nTo:\n${data.recipient_name}\n${data.recipient_address}\n\nDate: ${new Date(data.notice_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}\n\nSubject: ${data.subject}\n\nDear Sir/Madam,\n\nUnder instructions from and on behalf of my client, ${data.sender_name}, I hereby serve upon you the following legal notice:\n\n1. That my client states that the facts of the matter are as follows:\n\n${data.facts}\n\n2. That through this notice, my client seeks the following relief:\n\n${data.relief}\n\n3. That you are hereby called upon to comply with the above request within ${data.timeline} from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you at your own cost and risk.\n\nYours faithfully,\n\n[Advocate's Name]\n[Enrollment Number]`,
  },

  rti_application: {
    id: 'rti_application',
    name: 'RTI_STATUTORY_REQUEST',
    description: 'Statutory request for information under the RTI Act, 2005.',
    icon: FileText,
    category: 'Statutory',
    fields: [
      { id: 'applicant_name', label: 'Applicant Name', type: 'text' },
      { id: 'applicant_address', label: 'Applicant Address', type: 'textarea' },
      {
        id: 'public_authority',
        label: 'Public Information Officer',
        type: 'text',
        placeholder: 'Designated Public Authority',
      },
      { id: 'information_requested', label: 'Description of Information', type: 'textarea' },
      { id: 'bpl', label: 'BPL Status', type: 'select', options: ['No', 'Yes'] },
    ],
    generate: (data) =>
      `FORM A\nApplication for Information under Section 6(1) of the RTI Act, 2005\n\nTo,\nThe Public Information Officer,\n${data.public_authority}\n\nSubject: Formal Request for Information under RTI Act, 2005\n\nRespected Sir/Madam,\n\nI, ${data.applicant_name}, resident of ${data.applicant_address}, hereby request you to provide the following information:\n\n${data.information_requested}\n\n${data.bpl === 'Yes' ? 'I am a BPL cardholder and exempted from fee submission.' : 'An application fee of Rs. 10/- is enclosed via [Payment Method].'}\n\nDate: ${new Date().toLocaleDateString()}\nYours faithfully,\n${data.applicant_name}`,
  },

  consumer_complaint: {
    id: 'consumer_complaint',
    name: 'CONSUMER_PETITION',
    description: 'Formal grievance under the Consumer Protection Act, 2019.',
    icon: Shield,
    category: 'Consumer',
    fields: [
      { id: 'complainant_name', label: 'Complainant Full Name', type: 'text' },
      { id: 'opposite_party_name', label: 'Opposite Party (Respondent)', type: 'text' },
      { id: 'purchase_date', label: 'Transaction Date', type: 'date' },
      { id: 'amount_paid', label: 'Consideration Paid (₹)', type: 'number' },
      { id: 'deficiency', label: 'Nature of Deficiency', type: 'textarea' },
      { id: 'relief_sought', label: 'Redressal Sought', type: 'textarea' },
    ],
    generate: (data) =>
      `CONSUMER COMPLAINT\n\nBefore the District Consumer Disputes Redressal Commission\n\nIn the matter of:\n${data.complainant_name} vs ${data.opposite_party_name}\n\n1. That the complainant purchased the product/service on ${data.purchase_date} for a sum of ₹${data.amount_paid}.\n2. That the complainant observed the following deficiency in service:\n${data.deficiency}\n3. That the complainant seeks the following redressal:\n${data.relief_sought}\n\nDate: ${new Date().toLocaleDateString()}\nComplainant Signature: ___________`,
  },

  bns_complaint: {
    id: 'bns_complaint',
    name: 'BNS_CRIMINAL_COMPLAINT',
    description: 'Criminal complaint/FIR application under Bharatiya Nyaya Sanhita.',
    icon: Milestone,
    category: 'Criminal',
    fields: [
      { id: 'complainant_name', label: 'Complainant Full Name', type: 'text' },
      { id: 'police_station', label: 'Jurisdictional Police Station', type: 'text' },
      { id: 'incident_date', label: 'Date of Incident', type: 'date' },
      {
        id: 'accused_name',
        label: 'Accused Identity (if known)',
        type: 'text',
        placeholder: 'Name or "Unknown Persons"',
      },
      {
        id: 'incident_details',
        label: 'Incident Narrative',
        type: 'textarea',
        placeholder: 'Detailed account of the criminal offence',
      },
      {
        id: 'offence_type',
        label: 'Classification of Offence',
        type: 'select',
        options: [
          'Theft / Snatching',
          'Physical Assault',
          'Fraud / Cheating',
          'Harassment',
          'Other Offences',
        ],
      },
    ],
    generate: (data) =>
      `COMPLAINT UNDER BNSS SECTION 173\n\nTo,\nThe Station House Officer (SHO),\nPolice Station: ${data.police_station}\n\nSubject: Formal complaint regarding ${data.offence_type} occurred on ${data.incident_date}.\n\nRespected Sir,\n\nI, ${data.complainant_name}, hereby report a criminal offence committed against me. \n\n1. Incident Timeline: The incident occurred on ${data.incident_date} at approximately [Time].\n2. Accused Details: ${data.accused_name}.\n3. Factual Narrative: ${data.incident_details}\n\nI request you to register a First Information Report (FIR) under relevant sections of the Bharatiya Nyaya Sanhita (BNS) 2023 and initiate immediate investigative procedures.\n\nDate: ${new Date().toLocaleDateString()}\nSignature: ___________`,
  },
};

export default function DocumentGeneratorPage() {
  const { success, info } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleFieldChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    const doc = selectedTemplate.generate(formData);
    setGeneratedDoc(doc);
    success({ title: 'Document Generated', message: 'The draft has been professionally formulated.' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    info({ title: 'Copied', message: 'Document content copied to clipboard.' });
  };

  const handleDownload = () => {
    if (!generatedDoc) return;
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      const lines = doc.splitTextToSize(generatedDoc, 170);
      let y = 20;
      const pageHeight = 280;
      
      lines.forEach(line => {
        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 6;
      });
      
      doc.save(`${selectedTemplate.id}_draft.pdf`);
      success({ title: 'PDF Downloaded', message: 'Document saved securely.' });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      const blob = new Blob([generatedDoc], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTemplate.id}_draft.txt`;
      link.click();
      URL.revokeObjectURL(url);
      success({ title: 'Downloaded as TXT', message: 'System fallback utilized.' });
    }
  };

  return (
    <div className="min-h-screen bg-void pb-32 font-mono">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-32 space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-void border-2 border-gold/40 text-gold text-[10px] uppercase font-extrabold tracking-[0.5em] italic rounded-sm shadow-luxe font-display">
            <FileText className="w-5 h-5" />
            <span>DOCUMENT_STATUTORY_ENGINE_V1.2</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none italic text-white text-center">
            INSTITUTIONAL <span className="text-gold">DRAFTING</span>
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.3em] italic opacity-60">
            FORMULATE STATUTORY NOTICES, PROCEDURAL APPLICATIONS, AND COMPLAINTS WITH PRECISION USING VALIDATED STATUTORY TEMPLATES.
          </p>
        </div>

        {!selectedTemplate ? (
          /* Template Selection */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.values(DOCUMENT_TEMPLATES).map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedTemplate(template)}
                className="bg-void p-10 rounded-sm border-2 border-white/5 text-left space-y-6 group transition-all hover:border-gold/30 shadow-hard"
              >
                <div className="w-14 h-14 bg-void border-2 border-white/5 rounded-sm flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-midnight transition-colors shadow-inner">
                  <template.icon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-widest italic">{template.name}</h3>
                  <p className="text-sm text-text-tertiary font-body italic opacity-60">
                    {template.description}
                  </p>
                </div>
                <div className="pt-4">
                  <span className="text-[10px] font-extrabold text-gold uppercase tracking-widest bg-gold/5 px-3 py-1 rounded-sm border-2 border-gold/20 italic shadow-hard">
                    {template.category}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          /* Form & Preview */
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setGeneratedDoc('');
                  setFormData({});
                }}
                className="flex items-center gap-3 text-text-tertiary hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-widest border-2 border-white/5 px-6 py-3 rounded-sm bg-void shadow-hard"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Templates
              </button>

              <div className="bg-void rounded-sm border-2 border-white/10 p-10 space-y-10 shadow-hard relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-sm" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-void border-2 border-gold/20 rounded-sm flex items-center justify-center text-gold shadow-luxe">
                    <selectedTemplate.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gold font-bold uppercase tracking-widest opacity-60">Form Input</p>
                    <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                      {selectedTemplate.name}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-8 relative z-10">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.id} className="space-y-3">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary opacity-40 ml-2">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-void border-2 border-white/10 rounded-sm p-5 text-[15px] text-white focus:border-gold outline-none h-40 resize-none transition-all placeholder:text-white/10 italic shadow-inner"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-void border-2 border-white/10 rounded-sm p-5 text-[15px] text-white focus:border-gold outline-none transition-all appearance-none cursor-pointer italic shadow-inner"
                        >
                          <option value="">Select Option</option>
                          {field.options.map((o) => (
                            <option key={o} value={o} className="bg-void text-white">
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-void border-2 border-white/10 rounded-sm p-5 text-[13px] text-white focus:border-gold outline-none transition-all placeholder:text-white/10 font-mono italic shadow-inner"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full bg-gold hover:bg-gold-light text-midnight py-6 rounded-sm border-2 border-gold-light/20 font-extrabold uppercase tracking-widest transition-all shadow-luxe active:translate-y-[2px] italic"
                >
                  CONSTRUCT_STATUTORY_DRAFT
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-10 h-full">
              <div className="bg-void rounded-sm border-2 border-white/10 p-10 h-full min-h-[700px] flex flex-col shadow-hard relative overflow-hidden group/preview">
                <div className="absolute inset-0 bg-gold/[0.02] opacity-50 group-hover/preview:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <Eye className="w-5 h-5 text-gold opacity-60" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary opacity-40">
                      Draft Preview
                    </span>
                  </div>
                  {generatedDoc && (
                    <div className="flex gap-4">
                      <button
                        onClick={handleCopy}
                        className="p-3 bg-void border-2 border-white/10 rounded-sm hover:border-gold/40 transition-all shadow-hard"
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-3 bg-gold border-2 border-gold-light/20 rounded-sm hover:bg-gold-light transition-all shadow-hard"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5 text-midnight" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-void rounded-sm p-8 border-2 border-white/5 font-body text-sm leading-relaxed text-text-secondary overflow-y-auto whitespace-pre-wrap relative z-10 italic opacity-90 custom-scrollbar shadow-inner">
                  {generatedDoc ||
                    "Enter the required details and select 'Formulate Draft' to generate your professional legal document."}
                </div>

                {generatedDoc && (
                  <div className="mt-10 flex items-start gap-5 p-6 bg-gold/5 border-2 border-gold/20 rounded-sm relative z-10 shadow-hard">
                    <AlertTriangle className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Legal Advisory</p>
                      <p className="text-[11px] text-text-tertiary/70 font-body leading-relaxed">
                        This document is a generated draft based on the information provided. It serves as a tool for formulation and should be reviewed by a legal professional before formal execution.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
