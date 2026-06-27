## 2026-06-26 — Implement Structural Data Redaction

**Data traced:** PII (Email, Password, SSN, Credit Card Numbers, API Keys)
**Exposure found:** Sensitive values could be leaked through application logs, error stack traces, and unredacted payloads logged by Express/Winston. Additionally, error details (`err.stack` and `err.message`) were returned in cleartext to the client in development mode, allowing internal structures to leak.
**Fix:**
- Implemented a custom Winston redaction formatter (`redactLog`) in `server.js` that recursively traverses log objects to irrecoverably mask sensitive string patterns and exact key matches (`email`, `password`, `ssn`, `apiKeys`).
- Modified Express API error handlers (`/api/chat`, `/api/voice/process`, global fallback) to log the actual error securely but return generic 'Internal Server Error' messages to the client instead of raw stack traces.
**Coverage confirmed:** Verified that logger modifications are active in the `server.js` Winston initialization and that Express error handlers no longer expose `err.message` or `err.stack` in JSON responses.
**Still exposed elsewhere:** There may still be client-side console logs exposing user input directly, which should be investigated and removed in subsequent sessions.
