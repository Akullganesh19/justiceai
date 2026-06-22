## 2026-06-22 — [Remove plaintext PII exposure in logs]
**Data traced:** PII (emails, phone numbers, SSNs, credit card numbers, and other sensitive chat content) inside the latest user message
**Exposure found:** `server.js` lines 824 and 194. The `console.log` for Ollama routing leaks up to 50 characters of the user's latest query, which may contain highly sensitive personal information. Also, `logger.log` captures paths which might have PII in query params but that is somewhat mitigated by the `xssMiddleware`.
**Fix:** Removed the `console.log` that explicitly prints the `latestUserMessage`. Also introduced a custom Winston format for structural redaction on the main logger (if any other properties are logged).
**Coverage confirmed:** TBD
**Still exposed elsewhere:** TBD
