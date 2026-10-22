## 2026-10-22 — Unauthenticated RAG Document Management
**Attacked:** `POST /api/upload`, `DELETE /api/documents`, `DELETE /api/documents/:source`
**Found:** These endpoints had no authentication or authorization checks. Any user could upload arbitrary files to the RAG vector store or delete all/some document context, allowing complete denial of service or poisoning of AI context.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware using `crypto.timingSafeEqual` against `ADMIN_SECRET`.
**Systemic pattern:** All backend data mutation endpoints must be audited for proper authorization checks, not just frontend routes.
