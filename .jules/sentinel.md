## 2024-05-24 — Unauthenticated Destructive RAG Endpoints
**Attacked:** `POST /api/upload`, `DELETE /api/documents`, `DELETE /api/documents/:source` in `server.js`
**Found:** These destructive endpoints for managing the RAG vector store and uploading files lacked authentication, allowing any external user to wipe the document database or upload malicious files.
**Severity:** 🔴
**Fixed or flagged:** Fixed by implementing an `adminAuth` middleware requiring a Bearer token matching `ADMIN_SECRET` (with timing-safe comparison) and enforcing a 500 error in production if the secret is missing.
**Systemic pattern:** Missing authentication on internal/admin-only management routes. Always verify that backend-only utility routes used by internal scripts or admins are protected when exposed on a public server.
