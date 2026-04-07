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
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

// Document templates
const DOCUMENT_TEMPLATES = {
  legal_notice: {
    id: 'legal_notice',
    name: 'Legal Notice',
    description: 'Send a formal legal notice before filing a case',
    icon: FileCheck,
    category: 'General',
    fields: [
      { id: 'sender_name', label: 'Your Name', type: 'text', placeholder: 'Full name' },
      {
        id: 'sender_address',
        label: 'Your Address',
        type: 'textarea',
        placeholder: 'Complete address with pin code',
      },
      {
        id: 'recipient_name',
        label: 'Recipient Name',
        type: 'text',
        placeholder: 'Name of person/organization',
      },
      {
        id: 'recipient_address',
        label: 'Recipient Address',
        type: 'textarea',
        placeholder: 'Complete address',
      },
      { id: 'notice_date', label: 'Date of Notice', type: 'date' },
      { id: 'subject', label: 'Subject', type: 'text', placeholder: 'Brief subject of the notice' },
      {
        id: 'facts',
        label: 'Facts of the Case',
        type: 'textarea',
        placeholder: 'Describe the events in detail',
      },
      {
        id: 'relief',
        label: 'Relief Sought',
        type: 'textarea',
        placeholder: 'What do you want from the recipient?',
      },
      {
        id: 'timeline',
        label: 'Timeline for Response',
        type: 'text',
        placeholder: 'e.g., 15 days, 30 days',
      },
    ],
    generate: (data) =>
      `LEGAL NOTICE\n\nFrom:\n${data.sender_name}\n${data.sender_address}\n\nTo:\n${data.recipient_name}\n${data.recipient_address}\n\nDate: ${new Date(data.notice_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}\n\nSubject: ${data.subject}\n\nDear Sir/Madam,\n\nUnder instructions from and on behalf of my client, ${data.sender_name}, I hereby serve upon you the following legal notice:\n\n1. That my client states that the facts of the matter are as follows:\n\n${data.facts}\n\n2. That through this notice, my client seeks the following relief:\n\n${data.relief}\n\n3. That you are hereby called upon to comply with the above request within ${data.timeline} from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you at your own cost and risk.\n\nYours faithfully,\n\n[Advocate's Name]\n[Enrollment Number]`,
  },

  rti_application: {
    id: 'rti_application',
    name: 'RTI Application',
    description: 'File an RTI application to get information from government',
    icon: FileText,
    category: 'RTI',
    fields: [
      { id: 'applicant_name', label: 'Applicant Name', type: 'text' },
      { id: 'applicant_address', label: 'Address', type: 'textarea' },
      {
        id: 'public_authority',
        label: 'Public Authority',
        type: 'text',
        placeholder: 'e.g., Ministry of Finance',
      },
      { id: 'information_requested', label: 'Information Requested', type: 'textarea' },
      { id: 'bpl', label: 'BPL Cardholder?', type: 'select', options: ['No', 'Yes'] },
    ],
    generate: (data) =>
      `RTI APPLICATION\nUnder Section 6 of the Right to Information Act, 2005\n\nTo,\nThe Public Information Officer,\n${data.public_authority}\n\nSubject: Application for Information under RTI Act, 2005\n\nRespected Sir/Madam,\n\nI, ${data.applicant_name}, resident of ${data.applicant_address}, hereby request you to provide the following information:\n\n${data.information_requested}\n\n${data.bpl === 'Yes' ? 'I am a BPL cardholder and exempted from fee.' : 'Application fee of Rs. 10/- is enclosed.'}\n\nDate: ${new Date().toLocaleDateString()}\nYours faithfully,\n${data.applicant_name}`,
  },

  consumer_complaint: {
    id: 'consumer_complaint',
    name: 'Consumer Complaint',
    description: 'File a complaint under Consumer Protection Act, 2019',
    icon: Shield,
    category: 'Consumer',
    fields: [
      { id: 'complainant_name', label: 'Complainant Name', type: 'text' },
      { id: 'opposite_party_name', label: 'Opposite Party Name', type: 'text' },
      { id: 'purchase_date', label: 'Date of Purchase', type: 'date' },
      { id: 'amount_paid', label: 'Amount Paid (₹)', type: 'number' },
      { id: 'deficiency', label: 'Deficiency / Defect', type: 'textarea' },
      { id: 'relief_sought', label: 'Relief Sought', type: 'textarea' },
    ],
    generate: (data) =>
      `CONSUMER COMPLAINT\n\nBefore the District Consumer Disputes Redressal Commission\n\nIn the matter of:\n${data.complainant_name} vs ${data.opposite_party_name}\n\n1. That the complainant purchased the product/service on ${data.purchase_date} for a sum of ₹${data.amount_paid}.\n2. That the complainant observed the following deficiency:\n${data.deficiency}\n3. That the complainant seeks the following relief:\n${data.relief_sought}\n\nDate: ${new Date().toLocaleDateString()}\nComplainant Signature: ___________`,
  },

  bns_complaint: {
    id: 'bns_complaint',
    name: 'BNS Police Complaint',
    description: 'Draft a criminal complaint (FIR application) under BNS 2023',
    icon: Milestone,
    category: 'Criminal',
    fields: [
      { id: 'complainant_name', label: 'Your Name', type: 'text' },
      { id: 'police_station', label: 'Police Station Name', type: 'text' },
      { id: 'incident_date', label: 'Date of Incident', type: 'date' },
      {
        id: 'accused_name',
        label: 'Accused (if known)',
        type: 'text',
        placeholder: 'Name or "Unknown"',
      },
      {
        id: 'incident_details',
        label: 'Details of Incident',
        type: 'textarea',
        placeholder: 'Describe what happened in detail',
      },
      {
        id: 'offence_type',
        label: 'Offence Type',
        type: 'select',
        options: [
          'Theft / Snatching',
          'Physical Assault',
          'Fraud / Cheating',
          'Harassment',
          'Other',
        ],
      },
    ],
    generate: (data) =>
      `COMPLAINT UNDER BNSS SECTION 173\n\nTo,\nThe SHO,\nPolice Station: ${data.police_station}\n\nSubject: Formal complaint regarding ${data.offence_type} on ${data.incident_date}.\n\nRespected Sir,\n\nI, ${data.complainant_name}, wish to report a criminal offence committed against me. \n\n1. Incident: The incident occurred on ${data.incident_date} at around [Time].\n2. Accused: ${data.accused_name}.\n3. Description: ${data.incident_details}\n\nI request you to register an FIR under relevant sections of the Bharatiya Nyaya Sanhita (BNS) 2023 and initiate an investigation.\n\nDate: ${new Date().toLocaleDateString()}\nSignature: ___________`,
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
    success({ title: 'Document Generated', message: 'Draft created successfully' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    info({ title: 'Copied!', message: 'Document copied to clipboard' });
  };

  const handleDownload = () => {
    if (!generatedDoc) return;
    
    try {
      // Initialize PDF document
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Document styling
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      
      // Auto-wrap text at 180mm width
      const lines = doc.splitTextToSize(generatedDoc, 180);
      
      // Write to PDF with auto-pagination
      let y = 20;
      const pageHeight = 280; // A4 height roughly 297mm, leave padding
      
      for (let i = 0; i < lines.length; i++) {
        if (y > pageHeight) {
          doc.addPage();
          y = 20; // reset to top margin
        }
        
        doc.setFontSize(11);
        doc.text(lines[i], 15, y);
        y += 6; // line height
      }
      
      // Trigger download
      doc.save(`${selectedTemplate.id}_draft.pdf`);
      success({ title: 'PDF Downloaded!', message: 'Document saved securely to your device.' });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Fallback to text file if PDF rendering completely fails
      const blob = new Blob([generatedDoc], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTemplate.id}_draft.txt`;
      link.click();
      URL.revokeObjectURL(url);
      success({ title: 'Downloaded as TXT!', message: 'Document saved to your device as a text falback.' });
    }
  };

  return (
    <div className="min-h-screen bg-void pb-8 flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-32 w-full space-y-12 pb-24">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple/10 text-purple-light text-[10px] uppercase font-bold tracking-[0.2em] rounded-full border border-purple/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Smart Document Generator</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-semibold">
            Draft with <span className="text-purple-gradient">Precision</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-body">
            Create professional legal notices, RTI applications, and police complaints instantly
            with validated templates.
          </p>
        </div>

        {!selectedTemplate ? (
          /* Template Selection */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(DOCUMENT_TEMPLATES).map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedTemplate(template)}
                className="bg-raised p-6 rounded-[24px] border border-white/5 text-left space-y-4 group transition-all hover:border-purple/30"
              >
                <div className="w-12 h-12 bg-purple/10 rounded-2xl flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-ink transition-colors">
                  <template.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display text-white">{template.name}</h3>
                  <p className="text-xs text-text-tertiary mt-1 font-body">
                    {template.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[10px] font-bold text-purple uppercase tracking-widest">
                    {template.category}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          /* Form & Preview */
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setGeneratedDoc('');
                  setFormData({});
                }}
                className="flex items-center gap-2 text-text-tertiary hover:text-purple transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <ChevronDown className="w-4 h-4 rotate-90" /> Change Template
              </button>

              <div className="bg-raised rounded-[32px] border border-white/5 p-8 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-purple/10 rounded-xl flex items-center justify-center text-purple">
                    <selectedTemplate.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-display text-white">
                    {selectedTemplate.name} Details
                  </h3>
                </div>

                <div className="grid gap-6">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-ink border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple outline-none h-32 resize-none"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-ink border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple outline-none"
                        >
                          <option value="">-- Select Option --</option>
                          {field.options.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-ink border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full bg-purple hover:bg-purple-light text-ink py-4 rounded-2xl font-bold transition-all shadow-xl shadow-purple/20"
                >
                  Draft Document
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="bg-ink rounded-[32px] border border-white/5 p-8 h-full min-h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-purple-light" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">
                      Live Draft Preview
                    </span>
                  </div>
                  {generatedDoc && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-void/5 rounded-lg hover:bg-void/10 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 bg-purple/10 rounded-lg hover:bg-purple/20 transition-colors"
                      >
                        <Download className="w-4 h-4 text-purple" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-void/50 rounded-2xl p-6 border border-white/5 font-mono text-xs leading-relaxed text-text-secondary overflow-y-auto whitespace-pre-wrap">
                  {generatedDoc ||
                    "Your draft will appear here after you input the details and click 'Draft Document'."}
                </div>

                {generatedDoc && (
                  <div className="mt-8 flex items-start gap-4 p-4 bg-accent-warning/5 border border-accent-warning/20 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-accent-warning shrink-0 mt-0.5" />
                    <p className="text-[10px] text-accent-warning/70 font-body">
                      <strong>LEGAL DISCLAIMER:</strong> This AI-generated draft is for
                      informational purposes only. It does not constitute legal advice. Please have
                      this document reviewed by a qualified advocate before formal submission.
                    </p>
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
