const fs = require('fs');
let code = fs.readFileSync('src/pages/DocumentsPage.jsx', 'utf8');

// 1. Lift state into DocumentsPage
// Replace function FormWizard signature
code = code.replace(
  /function FormWizard\(\s*\{\s*template,\s*onBack,\s*onGenerate\s*\}\s*\)\s*\{/g,
  'function FormWizard({ template, onBack, onGenerate, initialData = {} }) {'
);

// Update useState inside FormWizard
code = code.replace(
  /const\s+\[formData,\s*setFormData\]\s*=\s*useState\(\{\}\);/g,
  'const [formData, setFormData] = useState(initialData || {});'
);

code = code.replace(
  /function DocumentPreview\(\s*\{\s*document,\s*template,\s*onBack\s*\}\s*\)\s*\{/g,
  'function DocumentPreview({ document, template, onBack, onEdit }) {'
);

code = code.replace(
  /<span>EXPORT_PDF<\/span>\n\s*<\/button>\n\s*<\/div>/g,
  `<span>EXPORT_PDF</span>
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 bg-void border-2 border-white/10 hover:border-gold/30 text-text-secondary hover:text-white px-5 py-2.5 rounded-sm font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-hard"
            >
              <FileWarning className="w-4 h-4" />
              <span>EDIT_DRAFT</span>
            </button>
          )}
        </div>`
);

code = code.replace(
  /export default function DocumentsPage\(\)\s*\{/g,
  `export default function DocumentsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [stage, setStage] = useState('select'); // 'select' | 'form' | 'preview'
  const [initialData, setInitialData] = useState({});
  const [savedDocs, setSavedDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('justice_ai_documents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage when updated
  React.useEffect(() => {
    localStorage.setItem('justice_ai_documents', JSON.stringify(savedDocs));
  }, [savedDocs]);`
);

code = code.replace(
  /const handleSelect = \(template\) => \{/g,
  `const handleSelect = (template) => {
    setInitialData({});`
);

code = code.replace(
  /const handleGenerate = \(formData\) => \{/g,
  `const handleGenerate = (formData) => {
    // Generate doc
    const doc = selectedTemplate.generate(formData);
    setGeneratedDoc(doc);
    setStage('preview');

    // Save draft
    setSavedDocs(prev => {
      const updated = prev.filter(d => !(d.templateId === selectedTemplate.id && JSON.stringify(d.formData) === JSON.stringify(formData)));
      return [{
        id: Date.now().toString(),
        templateId: selectedTemplate.id,
        templateTitle: selectedTemplate.title,
        formData,
        date: new Date().toISOString()
      }, ...updated].slice(0, 10); // Keep last 10
    });
  };

  const handleEditDraft = () => {
    setStage('form');
  };

  const loadDraft = (draft) => {
    const template = DOCUMENT_TEMPLATES.find(t => t.id === draft.templateId);
    if (template) {
      setSelectedTemplate(template);
      setInitialData(draft.formData);
      setStage('form');
    }
  };

  const deleteDraft = (e, id) => {
    e.stopPropagation();
    setSavedDocs(prev => prev.filter(d => d.id !== id));
  };`
);

code = code.replace(
  /const handleReset = \(\) => \{/g,
  `const handleReset = () => {
    setInitialData({});`
);

code = code.replace(
  /<TemplateCard\n\s*key=\{template.id\}/g,
  `<TemplateCard
                    key={template.id}`
);

// Add recent drafts section to select page
code = code.replace(
  /\{\/\* Template Grid \*\/\}/g,
  `{/* Recent Drafts */}
              {savedDocs.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-gold shadow-luxe" />
                      RECENT_DRAFTS
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedDocs.map(draft => (
                      <div key={draft.id} onClick={() => loadDraft(draft)} className="group relative p-6 bg-void border-2 border-white/5 hover:border-gold/30 rounded-sm cursor-pointer transition-all shadow-hard">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-sm font-bold text-white group-hover:text-gold uppercase tracking-wider italic">{draft.templateTitle}</h3>
                          <button onClick={(e) => deleteDraft(e, draft.id)} className="p-1 text-text-tertiary hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-text-tertiary font-mono uppercase tracking-widest opacity-60">
                          {new Date(draft.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Grid */}`
);

code = code.replace(
  /<FormWizard\n\s*template=\{selectedTemplate\}\n\s*onBack=\{handleReset\}\n\s*onGenerate=\{handleGenerate\}\n\s*\/>/g,
  `<FormWizard
                template={selectedTemplate}
                onBack={handleReset}
                onGenerate={handleGenerate}
                initialData={initialData}
              />`
);

code = code.replace(
  /<DocumentPreview\n\s*document=\{generatedDoc\}\n\s*template=\{selectedTemplate\}\n\s*onBack=\{handleReset\}\n\s*\/>/g,
  `<DocumentPreview
                document={generatedDoc}
                template={selectedTemplate}
                onBack={handleReset}
                onEdit={handleEditDraft}
              />`
);


// Clean up duplicate declarations introduced by replace
code = code.replace(
  /const \[selectedTemplate, setSelectedTemplate\] = useState\(null\);\n  const \[generatedDoc, setGeneratedDoc\] = useState\(null\);\n  const \[stage, setStage\] = useState\('select'\); \/\/ 'select' \| 'form' \| 'preview'\n\n  const handleSelect = \(template\) => \{/g,
  `// Duplicate state removed
  const handleSelect = (template) => {`
);

fs.writeFileSync('src/pages/DocumentsPage.jsx', code);
