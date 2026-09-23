## 2026-09-24 — Missing Authentication on Document Deletion Endpoints
**Attacked:** `DELETE /api/documents` and `DELETE /api/documents/:source` in `server.js`
**Found:** Destructive endpoints that clear the RAG vector store document chunks were fully public without any authentication or authorization checks.
**Severity:** 🔴 Exploitable now
**Fixed or flagged:** Fixed. Added `adminAuth` middleware that checks `Authorization: Bearer <ADMIN_SECRET>`.
**Systemic pattern:** Search for other internal/destructive REST endpoints across the Node.js API that might lack authentication middleware.
