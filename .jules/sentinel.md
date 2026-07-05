## 2024-05-24 — Uncleaned uploaded files on processing failure
**Attacked:** POST `/api/upload`
**Found:** When a file is uploaded, multer saves it to the `uploads/` directory. However, if the file has an extension that multer allows but the server's processing logic rejects (e.g. `.doc`), the processing loop continues and skips the cleanup code (`fs.unlinkSync(filePath)`). This leaves the temporary file indefinitely in the `uploads/` directory, allowing a disk-exhaustion attack by repeatedly uploading validly-extended but unsupported (or corrupt) files.
**Severity:** 🔴
**Fixed or flagged:** Fixed
**Systemic pattern:** Make sure temp file cleanup happens in a `finally` block or right away for unsupported cases.
