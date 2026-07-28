## 2026-07-28 — PII and API Key Log Redaction
**Data traced:** PII (emails, SSNs, phone numbers, credit cards) in user messages, and sensitive keys (apiKeys, passwords).
**Exposure found:** Plaintext logging via `console.log` (e.g., `latestUserMessage`) and potential error objects via `console.error` and Winston logger in `server.js`.
**Fix:** Implemented deep object and string regex redaction wrapping all `console.*` methods and injected as a Winston format.
**Coverage confirmed:** Tested string PII redaction and object key redaction to ensure no leakage via logging.
**Still exposed elsewhere:** Third-party APIs (like Gemini, DeepSeek, Bhashini) still receive the unredacted messages, as required for functionality, but their own logging policies apply. IP addresses are still logged in access logs.
