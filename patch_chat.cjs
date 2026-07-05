const fs = require('fs');

const path = 'src/pages/ChatPage.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "  const deleteCase = (id) => {",
  "  const togglePin = (id) => {\n    setHistory((prev) =>\n      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))\n    );\n  };\n\n  const deleteCase = (id) => {"
);

content = content.replace(
  "          onDelete={deleteCase}\n        />",
  "          onDelete={deleteCase}\n          onTogglePin={togglePin}\n        />"
);

fs.writeFileSync(path, content);
console.log('ChatPage.jsx patched successfully.');
