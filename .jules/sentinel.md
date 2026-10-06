## 2026-10-06 — Unauthenticated RAG Mutations & DoS Vectors
**Attacked:** `POST /api/upload`, `DELETE /api/documents*`, File Upload Middleware, and Express Router
**Found:** RAG endpoints lacked authentication allowing arbitrary index clearing/poisoning. Multer size limits and malformed URIs caused unhandled exceptions crashing the Express server. External APIs lacked transient failure resilience.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware with `crypto.timingSafeEqual`, global error handlers for Multer/URI exceptions, and a `fetchWithRetry` wrapper for external calls.
**Systemic pattern:** Ensure all administrative/destructive endpoints have strict authentication and that all Express middleware correctly handles expected library-specific errors to prevent DoS.
