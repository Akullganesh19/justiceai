## 2024-10-26 — PII Leak in Chat API Logging
**Data traced:** PII (names, details) in chat messages sent to `/api/chat`
**Exposure found:** `console.log(\`[ROUTE] Incoming POST /api/chat - Body Keys: \${Object.keys(req.body || {}).join(', ')}\`);` and `console.log(\`Routing query to Ollama: "\${latestUserMessage.substring(0, 50)}..."\`);` leaks parts of user messages to the standard output.
**Fix:** Replace hardcoded `console.log` and `console.error` with a global logger overriding `console.log`, `console.error`, etc. utilizing a winston redactor format that masks sensitive data such as emails, phone numbers, aadhaar, PAN, card numbers using regex.
**Coverage confirmed:** Tested triggering API endpoints and verified logs.
**Still exposed elsewhere:**
