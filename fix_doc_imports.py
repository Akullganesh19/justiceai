with open('src/pages/DocumentsPage.jsx', 'r') as f:
    content = f.read()

# Add savedDocs to the component state
search1 = """  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [stage, setStage] = useState('select'); // 'select' | 'form' | 'preview'"""

replace1 = """  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [stage, setStage] = useState('select'); // 'select' | 'form' | 'preview'
  const [savedDocs, setSavedDocs] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('justice_ai_documents');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });"""

content = content.replace(search1, replace1)

# Add saving logic to handleGenerate
search2 = """  const handleGenerate = (formData) => {
    const doc = selectedTemplate.generate(formData);
    setGeneratedDoc(doc);
    setStage('preview');
  };"""

replace2 = """  const handleGenerate = (formData) => {
    const docText = selectedTemplate.generate(formData);
    setGeneratedDoc(docText);
    setStage('preview');

    const newDoc = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      title: selectedTemplate.title,
      content: docText,
      timestamp: new Date().toISOString(),
    };

    const updatedDocs = [newDoc, ...savedDocs];
    setSavedDocs(updatedDocs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('justice_ai_documents', JSON.stringify(updatedDocs));
    }
  };"""

content = content.replace(search2, replace2)

# Add vault handlers
search3 = """  const handleReset = () => {
    setSelectedTemplate(null);
    setGeneratedDoc(null);
    setStage('select');
  };"""

replace3 = """  const handleReset = () => {
    setSelectedTemplate(null);
    setGeneratedDoc(null);
    setStage('select');
  };

  const handleViewSaved = (doc) => {
    const template = DOCUMENT_TEMPLATES.find(t => t.id === doc.templateId) || { title: doc.title, id: doc.templateId };
    setSelectedTemplate(template);
    setGeneratedDoc(doc.content);
    setStage('preview');
  };

  const handleDeleteSaved = (e, id) => {
    e.stopPropagation();
    const updatedDocs = savedDocs.filter((d) => d.id !== id);
    setSavedDocs(updatedDocs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('justice_ai_documents', JSON.stringify(updatedDocs));
    }
  };"""

content = content.replace(search3, replace3)

# Add UI
search4 = """              </div>
            </motion.div>
          )}"""

replace4 = """              </div>

              {/* Saved Drafts Vault */}
              {savedDocs.length > 0 && (
                <div className="mt-24 space-y-8">
                  <div className="flex items-center gap-4 border-b-2 border-white/5 pb-4">
                    <Shield className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-display text-white uppercase tracking-widest italic">
                      SECURE_VAULT
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedDocs.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleViewSaved(doc)}
                        className="group bg-void border-2 border-white/5 hover:border-gold/30 p-6 rounded-sm cursor-pointer transition-all shadow-hard relative overflow-hidden"
                      >
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3">
                             <FileSearch className="w-5 h-5 text-gold" />
                             <h3 className="text-sm font-bold text-white uppercase tracking-wider">{doc.title}</h3>
                           </div>
                           <button
                             onClick={(e) => handleDeleteSaved(e, doc.id)}
                             className="text-white/20 hover:text-red-500 transition-colors p-1"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                         <p className="text-[10px] text-text-tertiary uppercase tracking-widest opacity-60 mb-4">
                           Generated on: {new Date(doc.timestamp).toLocaleDateString()}
                         </p>
                         <div className="text-xs text-text-secondary font-mono truncate opacity-50">
                           {doc.content.substring(0, 100)}...
                         </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}"""

content = content.replace(search4, replace4)

with open('src/pages/DocumentsPage.jsx', 'w') as f:
    f.write(content)
