## 2026-06-23 — [Redaction at Logging Layer for Sensitive API Payloads]
**Data traced:** PII (SSN, Email, Credit Card) and sensitive fields (query, prompt, message, text, audioContent, passwords, tokens).
**Exposure found:** `server.js` was echoing `latestUserMessage` directly to `console.log` in plaintext, and missing structural redaction for potential entire `req.body` structures leaking through Winston/Error logs.
**Fix:** Created and injected `redactFormat`, a custom Winston formatter in `server.js` that recursively scrubs objects for sensitive keys and redacts regex-matched PII from strings, replacing vulnerable `console.log` calls with safe `logger.info`.
**Coverage confirmed:** Verified the `server.js` modifications manually, confirming the formatter correctly overrides output before writing to transports.
**Still exposed elsewhere:** Currently unknown; backend logging layer is now secure but frontend analytics/tracking may still need independent verification.
