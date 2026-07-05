## 2026-07-05 — [File leak in Document Upload]
**Attacked:** POST `/api/upload` (File handling and validation logic)
**Found:** Temporary files uploaded via multer are not cleaned up if the file is skipped due to an unsupported file type, or if an error is thrown during PDF parsing. Over time, this allows an attacker to exhaust server disk space.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Replaced the `fs.unlinkSync` inside the `try` block with a `finally` block to guarantee cleanup.
**Systemic pattern:** Resource cleanup (file deletion, connection closing) failing to execute on error paths or early returns (`continue`, `break`, `return`). Look for similar file operations, temp directories, or unclosed database connections.

## 2026-07-05 — [Unauthenticated Document Deletion]
**Attacked:** DELETE `/api/documents/:source` and `/api/documents`
**Found:** Endpoints have no authentication or authorization checks. Any user can wipe the entire document knowledge base by sending a DELETE request to `/api/documents`.
**Severity:** 🔴
**Fixed or flagged:** Flagged. Requires a systemic auth/permissions architecture rather than a one-off patch.
**Systemic pattern:** Endpoints affecting core state (database deletion, configuration changes) missing middleware checks.
