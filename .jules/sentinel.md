## 2026-07-24 — Storage Exhaustion DoS in Document Upload
**Attacked:** `/api/upload` endpoint in `server.js` handling document parsing and chunking.
**Found:** Uploading corrupted `.pdf` files or unsupported file types (like `.docx`) triggered exceptions or a `continue` statement inside the `try` block, bypassing the `fs.unlinkSync(filePath)` cleanup logic. This allowed an attacker to rapidly upload garbage files and permanently exhaust the server's local file storage.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Moved the `fs.unlinkSync(filePath)` cleanup into a `finally` block and guarded it with `fs.existsSync(filePath)`. Also added explicit cleanup before the `continue` statement for unsupported file types.
**Systemic pattern:** Anywhere temporary files or resources (like multer file uploads or temp directories) are accessed within `try/catch` loops. Always perform resource cleanup in a `finally` block.
