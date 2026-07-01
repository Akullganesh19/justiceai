
## 2026-06-30 — Fix Disk Leak and Credential Leak in Express Server

**Attacked:** Express routes `/api/upload` and `/api/chat`
**Found:**
1. **Disk Leak in Upload:** The `/api/upload` route saved uploaded files to disk via `multer`. For unsupported file types (like `.docx`), it hit a `continue` block which bypassed `fs.unlinkSync()`, leaving the file on disk permanently. A malicious user could fill the server's disk with unsupported files.
2. **Credential Leak in Chat Error:** The `/api/chat` route passed raw `err.message` in the 500 JSON response. When the Gemini fallback fails, the Google API error explicitly contains the `GEMINI_API_KEY` (e.g., `Permission denied: Consumer 'api_key:AIzaSy...' has been suspended`). This leaked the server's root API keys to any user who hit the endpoint when the fallback failed.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added a `finally` block to `/api/upload` to ensure `fs.unlinkSync()` always runs. Added a redaction regex in `/api/chat` to strip `api_key:...` strings from the error message before sending to the client, and replaced raw error dump with a generic message for production.
**Systemic pattern:** Express error handlers dumping `err.message` directly into `res.json()`. Added a fix for `/api/embed` as well.
