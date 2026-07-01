## 2026-07-01 — Disk Exhaustion via File Uploads
**Attacked:** `/api/upload` endpoint in `server.js` handling `multer` uploads.
**Found:** Uploaded files were only deleted (`fs.unlinkSync(filePath)`) if the processing (chunking/embedding) completely succeeded. If an unsupported file type was encountered, or if the PDF extraction threw an error, the catch/continue blocks bypassed the cleanup. This allowed uncleaned temporary files to slowly accumulate, enabling a disk exhaustion DoS.
**Severity:** 🔴 Exploitable now
**Fixed or flagged:** Fixed by explicitly scoping `filePath` and ensuring `fs.unlinkSync` executes inside a `finally` block for every uploaded file.
**Systemic pattern:** Resource cleanup (e.g., files, connections, streams) existing only in the "happy path" rather than being enforced via `finally` blocks when exceptions can be thrown.
