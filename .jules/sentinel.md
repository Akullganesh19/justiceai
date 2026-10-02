## 2026-10-01 — Missing adminAuth on destructive endpoints
**Attacked:** `DELETE /api/documents` and `DELETE /api/documents/:source` and `POST /api/upload`
**Found:** These endpoints lack authorization and allow anyone to delete or modify RAG document data.
**Severity:** 🔴
**Fixed or flagged:** Fixed
**Systemic pattern:** Lack of authorization middleware on endpoints.

## 2026-10-01 — Unhandled URIError on malformed URI param
**Attacked:** `DELETE /api/documents/%`
**Found:** Express throws an unhandled URIError during decodeURIComponent which crashes the server / drops the request without handling it properly.
**Severity:** 🔴
**Fixed or flagged:** Fixed
**Systemic pattern:** Express route parsing crashes on malformed URI inputs unless specifically caught by an error handler.

## 2026-10-01 — Unhandled MulterError and Payload Too Large
**Attacked:** `POST /api/upload`
**Found:** Multer errors or large payloads could crash the server if not explicitly caught by the error handler middleware.
**Severity:** 🔴
**Fixed or flagged:** Fixed
**Systemic pattern:** Lack of global handler for Multer and large entity errors.
