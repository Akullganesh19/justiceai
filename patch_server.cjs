const fs = require('fs');
let serverJS = fs.readFileSync('server.js', 'utf8');

const redactionLogic = `
// --- PII Redaction for Logs ---
const redactPII = (text) => {
  if (typeof text !== 'string') return text;
  return text
    // Emails: j***@gmail.com
    .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/g, (m, name, domain) => \`\${name[0]}***@\${domain}\`)
    // Indian Phones
    .replace(/\\b(?:\\+?91[-.\\s]?)?[6-9]\\d{2}[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b/g, (m) => {
      const clean = m.replace(/[-.\\s+]/g, '');
      const last4 = clean.slice(-4);
      return \`+91-***-***-\${last4}\`;
    })
    // US Phones
    .replace(/\\b(?:\\+?1[-.\\s]?)?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})\\b/g, '***-***-$3')
    // SSN
    .replace(/\\b\\d{3}[-.\\s]?\\d{2}[-.\\s]?\\d{4}\\b/g, '***-**-****')
    // Aadhaar
    .replace(/\\b\\d{4}[-.\\s]?\\d{4}[-.\\s]?\\d{4}\\b/g, '****-****-****')
    // Credit Cards
    .replace(/\\b(?:\\d[ -]*?){13,16}\\b/g, '****-****-****-****');
};

const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const maskArgs = (args) => args.map(arg => {
  if (typeof arg === 'string') return redactPII(arg);
  if (arg instanceof Error) {
    arg.message = redactPII(arg.message);
    if (arg.stack) arg.stack = redactPII(arg.stack);
    return arg;
  }
  if (typeof arg === 'object' && arg !== null) {
    try {
      return JSON.parse(redactPII(JSON.stringify(arg)));
    } catch {
      return arg;
    }
  }
  return arg;
});

console.log = (...args) => originalConsoleLog.apply(console, maskArgs(args));
console.error = (...args) => originalConsoleError.apply(console, maskArgs(args));
console.warn = (...args) => originalConsoleWarn.apply(console, maskArgs(args));
// ------------------------------
`;

// Insert after imports
serverJS = serverJS.replace("const PORT = process.env.PORT || 3001;", "const PORT = process.env.PORT || 3001;\n" + redactionLogic);

// Replace body log
serverJS = serverJS.replace(
  /console\.log\(\`\[ROUTE\] Incoming POST \/api\/chat \- Body Keys\: \$\{Object\.keys\(req\.body \|\| \{\}\)\.join\(\', \'\)\}\`\)\;/g,
  "console.log(`[ROUTE] Incoming POST /api/chat`);"
);

// We need to redact latestUserMessage in the "Routing query to Ollama" log.
serverJS = serverJS.replace(
  /console\.log\(\`Routing query to Ollama\: \"\$\{latestUserMessage\.substring\(0, 50\)\}\.\.\.\"\`\)\;/g,
  "console.log(`Routing query to Ollama [Redacted for privacy]`);"
);

// Remove err.stack
serverJS = serverJS.replace(
  /details\: process\.env\.NODE_ENV \=\=\= \'development\' \? err\.stack \: undefined/g,
  "// details removed to prevent stack trace leakage"
);

fs.writeFileSync('server.js', serverJS);
console.log("Applied structural log redaction");
