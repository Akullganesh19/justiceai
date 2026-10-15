## 2024-10-15 — PII Leak in Logs & Unprotected Endpoints
**Data traced:** PII (Email, Phone, Aadhaar, PAN, etc) from user input and RAG documents.
**Exposure found:** `server.js` logging user inputs in plaintext (`Routing query to Ollama: [latestUserMessage]`). Admin API endpoints were unprotected.
**Fix:** Built a global console monkey-patch for irreversible PII redaction and `adminAuth` middleware for destructive admin API endpoints.
**Coverage confirmed:** Tested the logger with dummy user PII inputs and validated admin endpoints require `ADMIN_SECRET`.
**Still exposed elsewhere:** RAG files in `public/documents/` directly accessible.
