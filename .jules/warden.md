## 2026-07-16 — Structural Redaction for Application Logs
**Data traced:** PII (email, password, ssn, phone, dob, card_number, address) and secrets (apikey, token)
**Exposure found:** `winston` application logger and native `console.*` methods were logging raw payloads and errors containing plaintext sensitive data.
**Fix:** Implemented a deep, recursive structural redaction utility at the logger initialization in `server.js` (`redactFormat` for Winston, and proxying `console` methods) that irreversibly masks strings and replaces sensitive object keys with `[REDACTED]`.
**Coverage confirmed:** Verified via local simulated API requests that PII object keys like `email`/`password` and inline strings resembling email patterns are properly masked before hitting stdout or log files.
**Still exposed elsewhere:** Data remains functionally exposed to 3rd-party LLMs as part of standard RAG workflows, though this is by design for application functionality.
