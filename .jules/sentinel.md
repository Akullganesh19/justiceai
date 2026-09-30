## 2026-09-30 — Unauthenticated Document Deletion and Malformed URI Crash
**Attacked:** `DELETE /api/documents` and `DELETE /api/documents/:source` endpoints in `server.js`
**Found:**
1. Both endpoints lacked authentication, allowing any unauthenticated user to delete all RAG documents from the vector store.
2. `DELETE /api/documents/:source` crashes the server (500 Internal Server Error) when a malformed URI encoding (e.g., `%25` or `%`) is sent, causing an unhandled `URIError`.
**Severity:** 🔴 Exploitable now
**Fixed or flagged:** Fixed. Added `adminAuth` middleware to protect destructive document endpoints and implemented global `URIError` handling middleware.
**Systemic pattern:** Ensure all destructive API endpoints enforce authentication and authorization. Add global error handling for built-in Express/Node parsing errors like `URIError` to prevent process crashes or unhandled exceptions.
