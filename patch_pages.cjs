const fs = require('fs');

// --- 1. Patch EstimatorPage ---
let estimator = fs.readFileSync('src/pages/EstimatorPage.jsx', 'utf8');

// Add Oracle import
estimator = estimator.replace(
  "import { motion, AnimatePresence } from 'framer-motion';",
  "import { motion, AnimatePresence } from 'framer-motion';\nimport { Oracle } from '../lib/oracle.js';"
);

// Add useEffect to consume Oracle
const estimatorHookStr = `  const [caseType, setCaseType] = useState(null);`;
estimator = estimator.replace(
  estimatorHookStr,
  `  const [caseType, setCaseType] = useState(null);

  useEffect(() => {
    const context = Oracle.consumeContext('COST_ESTIMATION');
    if (context && context.type) {
      setCaseType(context.type);
      sessionStorage.removeItem('oracle_prediction'); // Consume it
    }
  }, []);`
);
// Import useEffect
estimator = estimator.replace(
    "import React, { useState, useMemo } from 'react';",
    "import React, { useState, useMemo, useEffect } from 'react';"
);

fs.writeFileSync('src/pages/EstimatorPage.jsx', estimator);


// --- 2. Patch CaseTrackerPage ---
let tracker = fs.readFileSync('src/pages/CaseTrackerPage.jsx', 'utf8');

tracker = tracker.replace(
  "import { useToast } from '../components/ui/Toast.jsx';",
  "import { useToast } from '../components/ui/Toast.jsx';\nimport { Oracle } from '../lib/oracle.js';"
);

const trackerStateStr = `  const [caseDetails, setCaseDetails] = useState({`;
tracker = tracker.replace(
    trackerStateStr,
    `  useEffect(() => {
    const context = Oracle.consumeContext('CASE_TRACKING');
    if (context) {
      if (context.title) setNewCaseName(context.title);
      if (context.type) setSelectedCaseType(context.type);
      setShowNewCaseModal(true);
      sessionStorage.removeItem('oracle_prediction'); // Consume it
    }
  }, []);

  const [caseDetails, setCaseDetails] = useState({`
);

fs.writeFileSync('src/pages/CaseTrackerPage.jsx', tracker);


// --- 3. Patch DocumentsPage ---
let docs = fs.readFileSync('src/pages/DocumentsPage.jsx', 'utf8');

docs = docs.replace(
  "import { DOCUMENT_TEMPLATES } from '../lib/documentTemplates';",
  "import { DOCUMENT_TEMPLATES } from '../lib/documentTemplates';\nimport { Oracle } from '../lib/oracle.js';"
);

// Add useEffect
docs = docs.replace(
  "import React, { useState, useRef } from 'react';",
  "import React, { useState, useRef, useEffect } from 'react';"
);

const docsStateStr = `  const [stage, setStage] = useState('select'); // 'select' | 'form' | 'preview'`;

docs = docs.replace(
    docsStateStr,
    `  const [stage, setStage] = useState('select'); // 'select' | 'form' | 'preview'

  useEffect(() => {
    const context = Oracle.consumeContext('DOCUMENT_GENERATION');
    if (context && context.templateId) {
      const template = DOCUMENT_TEMPLATES.find(t => t.id === context.templateId);
      if (template) {
        setSelectedTemplate(template);
        setStage('form');
        sessionStorage.removeItem('oracle_prediction'); // Consume it
      }
    }
  }, []);`
);

fs.writeFileSync('src/pages/DocumentsPage.jsx', docs);
