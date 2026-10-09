## 2023-10-10 — Redact Active PII and Case Data Leakage in Backend Logs
**Data traced:** User IP addresses and user chat queries (which may contain PII, SSNs, or sensitive case details).
**Exposure found:** Plaintext application logs (`console.log`) capturing chat queries and request logs capturing full IP addresses in `server.js`. Error objects were also fully dumped.
**Fix:** Masked IP addresses (last octet) in request logging, redacted chat queries to only log length, and restricted error logging to only emit `err.message` instead of the full object (which may contain request context with sensitive data).
**Coverage confirmed:** Verified via grep and running the server tests that the logs no longer emit raw query text, IP addresses are masked, and errors don't dump the full stack object.
**Still exposed elsewhere:** The `/api/documents` and `/api/documents/:source` deletion endpoints only remove chunks from memory but leave the physical uploaded files in `uploads/` and `public/documents/` forever without a deletion path.
