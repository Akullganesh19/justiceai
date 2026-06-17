const fs = require('fs');
let code = fs.readFileSync('src/pages/DocumentsPage.jsx', 'utf8');

code = code.replace(
  /  const deleteDraft = \(e, id\) => \{\n    e\.stopPropagation\(\);\n    setSavedDocs\(prev => prev\.filter\(d => d\.id !== id\)\);\n  \};\n    const doc = selectedTemplate\.generate\(formData\);\n    setGeneratedDoc\(doc\);\n    setStage\('preview'\);\n  \};/g,
  `  const deleteDraft = (e, id) => {
    e.stopPropagation();
    setSavedDocs(prev => prev.filter(d => d.id !== id));
  };`
);

fs.writeFileSync('src/pages/DocumentsPage.jsx', code);
