import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileWarning,
  ShoppingBag,
  FileSearch,
  Shield,
  ArrowLeft,
  ArrowRight,
  Copy,
  Download,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import Header from '../components/ui/Header';
import { DOCUMENT_TEMPLATES } from '../lib/documentTemplates';
import jsPDF from 'jspdf';

const ICONS = { FileWarning, ShoppingBag, FileSearch, Shield };

function TemplateCard({ template, onSelect, index }) {
  const Icon = ICONS[template.icon] || FileWarning;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(template)}
      className="group relative cursor-pointer"
    >
      <div className="h-full p-8 rounded-[32px] premium-blur border border-white/5 hover:border-purple/30 transition-all duration-500 overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-purple/5 blur-3xl group-hover:bg-purple/10 transition-all" />

        <div className="w-14 h-14 rounded-[20px] bg-raised border border-white/10 flex items-center justify-center mb-6 group-hover:border-purple/40 group-hover:scale-110 transition-all duration-500">
          <Icon className="w-7 h-7 text-purple-light" />
        </div>

        <h3 className="text-2xl font-display text-white mb-3 group-hover:text-purple transition-colors">
          {template.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed font-body mb-8 flex-1">
          {template.description}
        </p>

        <div className="flex items-center justify-between gap-3 bg-void/5 group-hover:bg-purple text-white group-hover:text-ink px-6 py-4 rounded-2xl font-bold transition-all">
          <span className="text-xs uppercase tracking-widest">Generate</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

function FormWizard({ template, onBack, onGenerate }) {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const fieldsPerStep = 3;
  const totalSteps = Math.ceil(template.fields.length / fieldsPerStep);
  const stepFields = template.fields.slice(
    currentStep * fieldsPerStep,
    (currentStep + 1) * fieldsPerStep,
  );

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const isStepValid = () => {
    return stepFields.filter((f) => f.required).every((f) => formData[f.id]?.toString().trim());
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onGenerate(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-raised border border-white/10 hover:border-purple/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h2 className="text-3xl font-display text-white">{template.title}</h2>
          <p className="text-sm text-text-tertiary font-body mt-1">Fill in the details below</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-void/5">
            <motion.div
              className="h-full purple-gradient"
              initial={{ width: 0 }}
              animate={{ width: i <= currentStep ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>

      {/* Fields */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="space-y-6"
        >
          {stepFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-[0.15em] text-text-secondary">
                {field.label}
                {field.required && <span className="text-accent-error">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                  rows={4}
                  className="w-full bg-ink border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-purple/40 transition-colors font-body resize-none"
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.id] || field.options?.[0] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full bg-ink border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-purple/40 transition-colors font-body"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className="w-full bg-ink border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-purple/40 transition-colors font-body"
                />
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
        <button
          onClick={() => (currentStep > 0 ? setCurrentStep((prev) => prev - 1) : onBack())}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep > 0 ? 'Previous' : 'Back'}</span>
        </button>

        <div className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary font-bold">
          Step {currentStep + 1} of {totalSteps}
        </div>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="flex items-center gap-2 bg-purple hover:bg-purple-light disabled:opacity-30 disabled:cursor-not-allowed text-ink px-6 py-3 rounded-2xl font-bold transition-all active:scale-95"
        >
          <span>{currentStep < totalSteps - 1 ? 'Next' : 'Generate Document'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function DocumentPreview({ document, template, onBack }) {
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(document);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = window.document.createElement('textarea');
      ta.value = document;
      window.document.body.appendChild(ta);
      ta.select();
      window.document.execCommand('copy');
      window.document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    // 1. Typography must look like a legal document
    doc.setFont('times', 'normal');

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    // 2. Add a header and footer to every page
    const addHeaderFooter = (pageNum) => {
      // Header
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Generated by JusticeAI \u2014 For Reference Purposes Only',
        pageWidth - margin,
        15,
        { align: 'right' },
      );

      // Footer
      doc.text(
        `Page ${pageNum}  |  Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' },
      );
    };

    let cursorY = margin + 10;
    let pageNum = 1;

    addHeaderFooter(pageNum);

    // Body Setup
    doc.setFontSize(12);
    doc.setTextColor(0);

    // Auto-paginating text splitting
    const lines = doc.splitTextToSize(document, maxWidth);

    lines.forEach((line) => {
      if (cursorY > pageHeight - margin - 20) {
        doc.addPage();
        pageNum++;
        addHeaderFooter(pageNum);
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont('times', 'normal');
        cursorY = margin + 10;
      }
      doc.text(line, margin, cursorY);
      cursorY += 6;
    });

    // 3. Add the disclaimer as the last line of every document
    cursorY += 10;
    if (cursorY > pageHeight - margin - 20) {
      doc.addPage();
      pageNum++;
      addHeaderFooter(pageNum);
      cursorY = margin + 10;
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('times', 'italic');
    const disclaimer =
      'This document is a template generated for informational purposes. It has not been reviewed by a licensed advocate. Do not submit to any court or authority without professional legal review.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, maxWidth);

    disclaimerLines.forEach((line) => {
      doc.text(line, margin, cursorY);
      cursorY += 5;
    });

    // 4. Filename should be descriptive
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `JusticeAI_${template.title.replace(/\\s+/g, '')}_${dateStr}.pdf`;

    doc.save(filename);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-raised border border-white/10 hover:border-purple/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h2 className="text-3xl font-display text-white">{template.title}</h2>
            <p className="text-sm text-accent-success font-body mt-1 flex items-center gap-2">
              <Check className="w-3.5 h-3.5" /> Document Generated Successfully
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-raised border border-white/10 hover:border-purple/30 text-text-secondary hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            {copied ? (
              <Check className="w-4 h-4 text-accent-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-purple hover:bg-purple-light text-ink px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="bg-ink border border-white/10 rounded-[24px] overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-raised/50">
          <div className="w-3 h-3 rounded-full bg-accent-error/60" />
          <div className="w-3 h-3 rounded-full bg-accent-warning/60" />
          <div className="w-3 h-3 rounded-full bg-accent-success/60" />
          <span className="ml-4 text-[10px] text-text-tertiary uppercase tracking-widest font-bold">
            Document Preview
          </span>
        </div>
        <pre
          ref={previewRef}
          className="p-8 text-sm text-text-primary font-mono leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[60vh] custom-scrollbar"
        >
          {document}
        </pre>
      </div>

      {/* Action Footer */}
      <div className="mt-8 p-6 bg-accent-warning/5 border border-accent-warning/10 rounded-2xl">
        <p className="text-xs text-accent-warning leading-relaxed font-body">
          <strong>⚠️ Important:</strong> This document is auto-generated for informational purposes
          only. Please have it reviewed by a qualified advocate before using it in any official
          capacity. Laws and procedures may vary by jurisdiction.
        </p>
      </div>
    </motion.div>
  );
}

export default function DocumentsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [stage, setStage] = useState('select'); // 'select' | 'form' | 'preview'

  const handleSelect = (template) => {
    setSelectedTemplate(template);
    setStage('form');
  };

  const handleGenerate = (formData) => {
    const doc = selectedTemplate.generate(formData);
    setGeneratedDoc(doc);
    setStage('preview');
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setGeneratedDoc(null);
    setStage('select');
  };

  return (
    <div className="min-h-screen bg-void pb-32">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 space-y-16">
        <AnimatePresence mode="wait">
          {stage === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Page Header */}
              <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple/10 text-purple-light text-[10px] uppercase font-bold tracking-[0.2em] rounded-full border border-purple/20">
                  <FileWarning className="w-3.5 h-3.5" />
                  <span>Document Generator</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-semibold">
                  Generate Legal <span className="text-purple-gradient">Documents</span>
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-body">
                  Create ready-to-use legal documents by filling in simple forms. Choose a template
                  to get started.
                </p>
              </div>

              {/* Template Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DOCUMENT_TEMPLATES.map((template, i) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelect}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'form' && selectedTemplate && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FormWizard
                template={selectedTemplate}
                onBack={handleReset}
                onGenerate={handleGenerate}
              />
            </motion.div>
          )}

          {stage === 'preview' && generatedDoc && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DocumentPreview
                document={generatedDoc}
                template={selectedTemplate}
                onBack={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
