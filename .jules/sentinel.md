## 2024-10-18 — Sentinel Fixes
**Attacked:** API trust boundaries (RAG manipulation endpoints `POST /api/upload`, `DELETE /api/documents`, `DELETE /api/documents/:source`) and express payload parsers.
**Found:**
1. Unauthenticated endpoints allowed manipulating the system-wide RAG state, enabling adversarial modification or deletion of legal indices.
2. Unhandled Multer and Express body parser size exceptions crashed the application layer with 500s or unexpected exits instead of a clean 413 or 400.
**Severity:** 🔴 Exploitable now
**Fixed or flagged:** Fixed. Added global error handlers for size limits and `adminAuth` middleware with `timingSafeEqual` and environment-strict configuration on destructive routes.
**Systemic pattern:** Internal utility or admin endpoints often forget to re-verify permissions assumed implicitly. Global error handling middlewares need to systematically account for library-specific errors like `MulterError`.
