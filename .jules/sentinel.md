## 2024-10-02 - [Unprotected Destructive RAG Endpoints]
**Attacked:** Destructive vector store endpoints (`DELETE /api/documents` and `POST /api/upload`)
**Found:** Missing authentication and authorization. Any user or unauthenticated request could arbitrarily clear or poison the vector store which operates the RAG engine for the legal assistant.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware with a constant time buffer comparison to verify tokens passed in `Authorization` headers against an expected secret (`process.env.ADMIN_SECRET`). The fix falls back securely by blocking requests with a 500 status code if `ADMIN_SECRET` is missing in production.
**Systemic pattern:** Look for other file handling or background task endpoints (e.g. `/api/voice/process`) that may execute expensive computation without rate-limiting or basic authentication.
