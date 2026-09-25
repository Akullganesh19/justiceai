## 2026-09-25 — Unprotected destructive endpoints
**Attacked:** `DELETE /api/documents` and `DELETE /api/documents/:source`
**Found:** Destructive endpoints that modify global state (clearing RAG document store) are completely unauthenticated and unprotected. Any user can trigger them. Memory states `The backend Express server protects destructive RAG vector store endpoints (like DELETE /api/documents) using an adminAuth middleware that verifies req.headers.authorization against process.env.ADMIN_SECRET.`, but this middleware does not exist in the code.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware and `ADMIN_SECRET` environment variable requirement to protect these endpoints.
**Systemic pattern:** Missing authentication checks on destructive APIs.

## 2026-09-25 — Unhandled Multer and URI errors
**Attacked:** `POST /api/upload` (with extremely large files > 10MB) and `GET /api/documents/%` (malformed URI parameter).
**Found:**
1. Sending a payload larger than 10MB to `/api/upload` triggers a `MulterError` (or `PayloadTooLargeError` depending on how the request is formed). The global error handler catches it but logs it as an "Unhandled error" and returns a 500 status code, potentially causing server stability issues or DoS if spammed.
2. Sending a malformed URI (like `%`) throws a `URIError` before route handlers, which also falls back to the generic 500 error handler. Memory notes suggest specifically handling these to return 413/400.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added specific error handling for `URIError`, `MulterError`, and `entity.too.large` in the global error handler middleware.
**Systemic pattern:** Express unhandled exceptions crashing server on malformed inputs.
