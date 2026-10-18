## 2025-02-17 — Unprotected Destructive API Endpoints
**Attacked:** POST `/api/upload`, DELETE `/api/documents/:source`, DELETE `/api/documents`
**Found:** These destructive and resource-intensive endpoints were completely exposed without any authentication, allowing arbitrary uploads or full data deletion of the RAG index.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware matching other auth implementations (via `req.headers.authorization` against `process.env.ADMIN_SECRET` using `crypto.timingSafeEqual` with `Buffer.from()`), and bound it to all three routes.
**Systemic pattern:** Lack of global middleware. New backend endpoints should always be verified for whether they need authentication rather than assuming they are safe by default.
