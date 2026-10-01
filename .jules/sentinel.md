## 2024-10-27 — [Missing Auth & Global Error Handling DoS]
**Attacked:** `DELETE /api/documents`, `DELETE /api/documents/:source`, `POST /api/upload`, `GET /api/%` (malformed URI), and `POST /api/chat` (payload too large).
**Found:**
1. Missing Authorization: The endpoints for deleting and uploading documents had no authentication checks, allowing anyone to wipe or manipulate the vector store.
2. Unhandled Errors: Malformed URI components (`%`) threw `URIError` and excessively large payloads threw `PayloadTooLargeError` (`entity.too.large`) and `MulterError`, which were uncaught in specific routes and defaulted to 500 status codes, exposing unhandled exception paths.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware utilizing `crypto.timingSafeEqual` and `process.env.ADMIN_SECRET` to protect destructive endpoints. Also caught `URIError`, `entity.too.large`, and `MulterError` in the global error handler mapping them to 400 and 413 safe responses respectively.
**Systemic pattern:** All backend Express endpoints should be scrutinized to ensure proper global error boundary trapping. Destructive endpoints must have authorization.
