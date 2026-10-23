## 2024-10-23 — Missing authentication on destructive RAG endpoints
**Attacked:** POST `/api/upload`, DELETE `/api/documents/:source`, DELETE `/api/documents` in `server.js`
**Found:** These administrative endpoints modify or destroy the global RAG vector store state without any authentication or authorization checks. An unauthenticated attacker can arbitrarily delete the entire knowledge base or upload malicious/garbage data, compromising the application's intelligence.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware using `crypto.timingSafeEqual` with `process.env.ADMIN_SECRET` to secure these endpoints, enforcing a 500 error in production if the secret is missing.
**Systemic pattern:** All endpoints that modify global application state (like the RAG vector store) must be protected by authentication.
