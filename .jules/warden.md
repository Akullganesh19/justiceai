## 2024-10-24 — Stop PII Leakage in Application Logs
**Data traced:** PII (Email, Indian Phone numbers, Aadhaar, PAN, Card numbers)
**Exposure found:** PII was actively leaking into application logs (winston & console methods) from incoming request bodies and error stacks (e.g. `req.body` logged when hitting `/api/chat`).
**Fix:** Created `src/lib/logger.js` which implements a global console overriding logger (`setupRedactedLogger`) and a custom `redactObject` formatter. Modified `server.js` to import and call `setupRedactedLogger()` at startup, and wrapped the winston logger with a custom redaction format.
**Coverage confirmed:** The winston logger and global console (log, error, warn, info) methods automatically strip PII from nested objects, Error stacks, and primitive strings.
**Still exposed elsewhere:** Currently only covering generic PII. Custom models or edge-case entities may still be unredacted. Database records currently remain untouched.
