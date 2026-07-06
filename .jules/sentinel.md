## 2026-07-06 — File Leak Vulnerability on /api/upload
**Attacked:** The POST /api/upload endpoint in `server.js`
**Found:** When uploading an unsupported file type (e.g., .doc, .exe), the route handled the error but failed to clean up the temporary file created by multer because the `fs.unlinkSync` command was bypassed when the `continue` statement was hit.
**Severity:** 🔴
**Fixed or flagged:** Fixed. I updated the file processing loop to use a `try...finally` block that ensures `fs.unlinkSync` is called on the uploaded file regardless of whether the processing succeeds or hits an unsupported type.
**Systemic pattern:** Ensure all file handling operations that create temporary files use `finally` blocks for guaranteed cleanup to prevent disk exhaustion attacks.
