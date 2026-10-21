## 2024-10-21 — Unredacted Winston Logger and Console Exposure
**Data traced:** PII, Email, Indian Phone, Aadhaar, PAN, Card Number
**Exposure found:** Plaintext exposure in application error/combined logs and standard output via `winston` and `console.log`.
**Fix:** Created `src/lib/logger.js` to implement `setupRedactedLogger` with deep object traversal and RegExp-based redaction, overriding global console methods to prevent accidental exposure. Integrated this into `server.js`.
**Coverage confirmed:** Tested nested object PII masking, date/error handling, circular reference prevention, and correctly wired the redacted logger in the main backend Express server.
**Still exposed elsewhere:** Currently unknown, further review of edge-case frontend analytics/exports may be required.
