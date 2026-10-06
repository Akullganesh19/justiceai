## 2026-10-06 — Unauthenticated Destructive RAG Endpoints
**Attacked:** `DELETE /api/documents`, `DELETE /api/documents/:source`, `POST /api/upload`
**Found:** These RAG vector store modification endpoints were completely unprotected, allowing any client to delete all documents or upload arbitrary data without authentication.
**Severity:** 🔴
**Fixed or flagged:** Fixed by implementing an `adminAuth` Express middleware that checks `req.headers.authorization` against an `ADMIN_SECRET` environment variable using a timing-safe equality check.
**Systemic pattern:** Search for other internal/admin endpoints missing authorization checks, particularly utility endpoints for data modification.
