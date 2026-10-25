## 2026-10-25 — Unprotected destructive endpoints
**Attacked:** `DELETE /api/documents/:source`, `DELETE /api/documents`, `POST /api/upload`
**Found:** These destructive RAG endpoints are fully accessible without any authentication. The adminAuth middleware mentioned in the documentation or memory is missing from `server.js`.
**Severity:** 🔴
**Fixed or flagged:** Flagged for fix. Will implement `adminAuth` middleware using `crypto.timingSafeEqual` as instructed in memory.
**Systemic pattern:** Missing authentication on admin endpoints.
