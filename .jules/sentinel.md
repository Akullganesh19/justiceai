## 2026-06-17 — Missing Authentication on Document Endpoints
**Attacked:** `POST /api/upload`, `DELETE /api/documents`, and `DELETE /api/documents/:source`
**Found:** These endpoints lack any authentication or authorization checks. A malicious actor can continually upload files to consume memory and CPU (DoS), or arbitrarily delete all in-memory RAG chunks, effectively bringing down the RAG intelligence functionality.
**Severity:** 🔴
**Fixed or flagged:** Flagged for human review. These endpoints need a robust permission/authentication model. I fixed a file leak bug that exacerbated this, but the core issue requires authorization implementation.
**Systemic pattern:** The API lacks global authentication middlewares, and relies entirely on obscure or client-side enforcement which bypasses actual server-side checks.

## 2026-06-17 — Latent File Leak in Document Upload
**Attacked:** `POST /api/upload`
**Found:** If document parsing or embedding failed (e.g. invalid PDF), the process jumped into the `catch` block and bypassed `fs.unlinkSync`, leaving orphaned artifacts in the `uploads/` directory leading to eventual disk-exhaustion DoS.
**Severity:** 🟡
**Fixed or flagged:** Fixed. Added a `try...finally` block to ensure `fs.unlinkSync` cleans up the `req.file` path regardless of parsing errors.

## 2026-06-17 — CORS Misconfiguration leading to Network Vulnerabilities
**Attacked:** CORS middleware
**Found:** The `CORS_ORIGIN` wildcard origin `*` was combined with `credentials: true`. This is invalid and blocked by modern browsers, but also creates a fallback parsing error where cross-origin requests might be overly permissive or incorrectly blocked depending on evaluation.
**Severity:** 🟡
**Fixed or flagged:** Fixed. Updated `process.env.CORS_ORIGIN` parsing to cleanly split `,` delimited lists or safely default to boolean `true` in non-prod environments.