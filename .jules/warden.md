## 2024-05-24 — [Global PII Log Redaction]
**Data traced:** Emails, Indian phone numbers, Aadhaar, PAN, and card numbers.
**Exposure found:** PII could leak in plaintext across console logs, error messages, and winston file logs across the application.
**Fix:** Implemented global console override `setupRedactedLogger` in `src/lib/logger.js` that intercepts and permanently redacts PII using Regex across string and object structures before it hits standard output or files.
**Coverage confirmed:** Tested string, arrays, and complex nested objects with circular references to ensure all paths mask sensitive fields.
**Still exposed elsewhere:** PII might still exist in unstructured user files or database instances directly, not yet deleted by automated scripts.
