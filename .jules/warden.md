## 2024-03-22 — Server-side Logger Redaction
**Data traced:** PII (Email, SSN, Credit Card) and sensitive keys (`apiKeys`, `password`, `token`, etc.)
**Exposure found:** `server.js` logged entire `req.body` objects directly via `console.log` and Winston (e.g., `[ROUTE] Incoming POST /api/chat - Body Keys: ...` or uncaught errors) which could inadvertently include plaintext sensitive configurations or user prompts containing PII.
**Fix:** Created `deepRedact` utility to traverse and mask specific keys and PII regexes recursively. Applied this utility as a Winston format step, and globally overrode native `console.log`, `console.warn`, and `console.error` to pipe through the custom Winston logger with redaction applied *before* `util.format`.
**Coverage confirmed:** Visually confirmed code execution and test of regexes. `console.log` now intercepts and masks `email`, `ssn`, `card_number`, etc.
**Still exposed elsewhere:** PII might still exist in unstructured text within generated PDF/TXT documents or in client-side logs/`localStorage`. We have solely focused on the backend server logs for this session.
