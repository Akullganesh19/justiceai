## 2025-XX-XX — Upload Temporary File Leak
**Attacked:** POST `/api/upload` endpoint
**Found:** If the file parsing fails (e.g., in `parsePdf` or `fs.readFileSync`), an error is thrown, and the execution skips `fs.unlinkSync(filePath);`. This leaves temporary files on disk forever, causing disk space leakage. It needs to be placed inside a `finally` block to ensure cleanup in both success and failure cases.
**Severity:** 🔴
**Fixed or flagged:** Fixed. I moved `fs.unlinkSync` to a `finally` block to always run.
**Systemic pattern:** File uploads using Multer must always clean up temp files via `finally` or explicitly on error.

## 2025-XX-XX — Raw Error PII / Structure Leak
**Attacked:** Express Error Handlers (`/api/chat`, `/api/upload`, `/api/embed`, `/api/voice/process`)
**Found:** Returning `err.message` directly as JSON (`res.status(500).json({ error: err.message })`) in production can leak internal server paths, database structures, or PII embedded in API error responses.
**Severity:** 🔴
**Fixed or flagged:** Fixed. I modified the catch blocks to log the error internally but return a generic string (e.g., 'Internal Server Error') unless `NODE_ENV === 'development'`.
**Systemic pattern:** All `catch(err)` blocks mapping to HTTP 500 should never pass `err.message` raw to the client unless explicitly required and sanitized.

## 2025-XX-XX — CORS Origin Wildcard Conflict
**Attacked:** Server CORS configuration
**Found:** Setting `credentials: true` with `origin: '*'` is invalid in CORS and will cause the browser to block the response. The codebase does: `origin: process.env.CORS_ORIGIN || (NODE_ENV === 'production' ? false : '*')`. In development or without `CORS_ORIGIN`, this fails for credentialed requests. Moreover, when `CORS_ORIGIN` is supplied, it's evaluated as a raw string, not a list.
**Severity:** 🔴
**Fixed or flagged:** Fixed. I updated the code to support comma-separated `CORS_ORIGIN` strings and evaluate them dynamically, removing the fallback to `'*'`.
**Systemic pattern:** Express `cors` config with `credentials: true` needs dynamic origin evaluation.
