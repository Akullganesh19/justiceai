const fs = require('fs');

const path = 'src/pages/DocumentsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(
  "import {",
  "import {\n  Save,\n  Archive,\n  Trash2,\n  FileText,\n  Clock,"
);

// 2. DocumentPreview: Add saved state and save method
content = content.replace(
  "const [copied, setCopied] = useState(false);",
  `const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);`
);

const saveMethod = `
  const handleSaveToVault = () => {
    try {
      if (typeof window !== 'undefined') {
        const currentVault = JSON.parse(localStorage.getItem('justice_ai_documents') || '[]');
        const newDoc = {
          id: Date.now().toString(),
          title: template.title || 'SAVED_DOCUMENT',
          document: document,
          date: new Date().toISOString()
        };
        currentVault.unshift(newDoc);
        localStorage.setItem('justice_ai_documents', JSON.stringify(currentVault));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (_err) {
      console.error('Failed to save to vault:', _err);
    }
  };
`;

content = content.replace(
  "const handleCopy = async () => {",
  `${saveMethod}\n  const handleCopy = async () => {`
);

// 3. DocumentPreview: Add Save to Vault button
const copyButton = `<button
            onClick={handleCopy}`;
const vaultButton = `<button
            onClick={handleSaveToVault}
            className="flex items-center gap-2 bg-void border-2 border-white/10 hover:border-gold/30 text-text-secondary hover:text-white px-4 py-2.5 rounded-sm text-[10px] font-extrabold uppercase tracking-widest transition-all italic shadow-hard"
          >
            {saved ? (
              <Check className="w-4 h-4 text-gold" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saved ? 'SAVED_VAULT' : 'SAVE_VAULT'}</span>
          </button>
          `;
content = content.replace(copyButton, vaultButton + copyButton);

// 4. DocumentsPage: Add vault state and methods
const pageState = `const [stage, setStage] = useState('select'); // 'select' | 'form' | 'preview'`;
const vaultStateAndMethods = `${pageState}
  const [vaultDocs, setVaultDocs] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('justice_ai_documents') || '[]');
      } catch (_err) {
        return [];
      }
    }
    return [];
  });

  const handleDeleteVaultDoc = (id) => {
    try {
      const updated = vaultDocs.filter(doc => doc.id !== id);
      setVaultDocs(updated);
      localStorage.setItem('justice_ai_documents', JSON.stringify(updated));
    } catch (_err) {
      console.error('Failed to delete doc:', _err);
    }
  };

  const handleOpenVaultDoc = (doc) => {
    setSelectedTemplate({ title: doc.title, generate: () => doc.document }); // Mock template structure for preview
    setGeneratedDoc(doc.document);
    setStage('preview');
  };`;
content = content.replace(pageState, vaultStateAndMethods);

// 5. DocumentsPage: handleReset to reload vault docs
const oldReset = `const handleReset = () => {
    setSelectedTemplate(null);
    setGeneratedDoc(null);
    setStage('select');
  };`;
const newReset = `const handleReset = () => {
    setSelectedTemplate(null);
    setGeneratedDoc(null);
    setStage('select');
    if (typeof window !== 'undefined') {
      try {
        setVaultDocs(JSON.parse(localStorage.getItem('justice_ai_documents') || '[]'));
      } catch (_err) {}
    }
  };`;
content = content.replace(oldReset, newReset);

// 6. DocumentsPage: Render Vault Section
const templateGrid = `{/* Template Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DOCUMENT_TEMPLATES.map((template, i) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelect}
                    index={i}
                  />
                ))}
              </div>`;

const vaultSection = `
              {/* Vault Section */}
              {vaultDocs.length > 0 && (
                <div className="mt-24">
                  <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                    <Archive className="w-5 h-5 text-gold" />
                    <h2 className="text-xl font-display font-bold uppercase tracking-widest text-white italic">
                      DOCUMENT_VAULT
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vaultDocs.map((doc) => (
                      <div key={doc.id} className="p-6 rounded-sm bg-void border-2 border-white/5 flex flex-col shadow-hard relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2 text-gold">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest font-bold">{doc.title}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteVaultDoc(doc.id); }} className="text-text-tertiary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-text-tertiary font-mono mb-6 line-clamp-3 overflow-hidden text-ellipsis opacity-60">
                          {doc.document.substring(0, 150)}...
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(doc.date).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleOpenVaultDoc(doc)}
                            className="text-[10px] uppercase tracking-widest font-bold text-white hover:text-gold transition-colors flex items-center gap-1"
                          >
                            OPEN <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
`;

content = content.replace(templateGrid, templateGrid + vaultSection);

fs.writeFileSync(path, content);
console.log('Successfully injected Document Vault into ' + path);
