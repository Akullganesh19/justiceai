const fs = require('fs');
const content = fs.readFileSync('src/pages/DocumentsPage.jsx', 'utf-8');
console.log(content.includes('Trash2') ? 'Trash2 imported' : 'No Trash2');
