const fs = require('fs');
let code = fs.readFileSync('src/pages/DocumentsPage.jsx', 'utf8');

// Replace Vault (${savedDocs.length}) with Vault ({savedDocs.length})
code = code.replace(/Vault \(\$\{savedDocs\.length\}\)/g, "Vault ({savedDocs.length})");

fs.writeFileSync('src/pages/DocumentsPage.jsx', code);
