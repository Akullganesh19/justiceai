## 2025-01-20 — Structural Logging Leak & Raw Error Exposure
**Data traced:** IPs, Emails, Passwords, Credit Cards, SSNs, DOBs, Addresses, Phone Numbers, API Keys, Tokens.
**Exposure found:**
1. Client metadata (`req.ip`, body contents) and application errors logged in plaintext via `console.log`/`console.error` bypassing standard redaction.
2. Global Express error handler and specific catch blocks leaked raw `err.message` and `err.stack` directly to client HTTP responses, potentially exposing PII or system topology.
**Fix:**
1. Added a custom Winston formatter (`redactLog`) to the top level of the server logger configuration. It uses a `WeakSet` to deep-clone payloads safely and strictly masks sensitive values.
2. Routed all backend console logging (`console.log`, `console.error`) in `server.js` to `logger.info` and `logger.error` to pass through the redaction layer.
3. Overhauled Express error handlers to strictly return generic strings (e.g. "An internal server error occurred") to clients while logging the actual details safely backend-side.
**Coverage confirmed:** `server.js` was modified. Validated syntax with `node -c server.js`. Winston transports apply redaction. Catch blocks and endpoints no longer serialize `err.message` in JSON responses.
**Still exposed elsewhere:**
- Third-party endpoints (e.g. Ollama, Bhashini) receive data in plaintext. This is currently functional by design but lacks explicit localized audit logs on what exactly was sent outbound.
- Application data (e.g. Chat history, onboarded lawyer data) is saved extensively to `localStorage` on the frontend, posing a risk on shared physical devices.
- No established deletion path for vector DB cache (document uploads).
