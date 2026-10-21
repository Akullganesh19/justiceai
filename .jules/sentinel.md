## 2026-04-14 — Unauthenticated RAG Management Endpoints
**Attacked:** `POST /api/upload`, `DELETE /api/documents`, `DELETE /api/documents/:source`
**Found:** These destructive RAG management routes were exposed without any authentication, allowing any unauthenticated user to upload arbitrary documents or delete the entire RAG knowledge base.
**Severity:** 🔴
**Fixed or flagged:** Fixed by implementing an `adminAuth` middleware using `crypto.timingSafeEqual` and `process.env.ADMIN_SECRET` to protect these routes. Added regression tests.
**Systemic pattern:** Future endpoints that mutate server state or the knowledge base must ensure they have proper authentication. Look for other unprotected mutating endpoints.
