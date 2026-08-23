const fs = require('fs');

const path = 'src/pages/DocumentsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the mangled import statement
content = content.replace(
  "import {\\n  Save,\\n  Archive,\\n  Trash2,\\n  FileText,\\n  Clock, motion, AnimatePresence } from 'framer-motion';",
  "import { motion, AnimatePresence } from 'framer-motion';"
);
content = content.replace(
  "import {\\n  FileWarning",
  "import {\\n  Save,\\n  Archive,\\n  Trash2,\\n  FileText,\\n  Clock,\\n  FileWarning"
);
fs.writeFileSync(path, content);
console.log('Fixed imports in ' + path);
