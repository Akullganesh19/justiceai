Findings:
1. `app.post('/api/upload')`: When an unsupported file type is uploaded (e.g. `.docx`), it hits the `else` block:
   ```javascript
   } else {
     failedFiles.push({ name: fileName, error: 'Unsupported file type' });
     continue;
   }
   ```
   However, `multer` has already saved the file to disk in `UPLOADS_DIR`. Because `fs.unlinkSync(filePath)` is at the end of the try block and `continue` skips it, the file is never deleted. This causes a disk leak. Normal users could easily fill up the disk with 10MB unsupported files.
   *Severity:* 🔴 (Exploitable resource exhaustion/disk leak)

2. `app.post('/api/chat')`: The error handler catches all errors and returns them:
   ```javascript
   res.status(500).json({
     error: err.message,
     details: process.env.NODE_ENV === 'development' ? err.stack : undefined
   });
   ```
   When `provider === 'auto'`, it falls back to Gemini. The fallback error chain `err.message` from Gemini explicitly contains the API key in the `containerInfo` or message:
   `Permission denied: Consumer 'api_key:AIzaSyBlYdk...' has been suspended.`
   This exact message is returned directly to the client in the `error` property! This leaks the server's environment `GEMINI_API_KEY` to any client that hits an error when Ollama fails. (We see this in `test_error_leak.js`).
   *Severity:* 🔴 (Exploitable credential leak)

3. Concurrency: `app.delete('/api/documents')` simply does `documentChunks = []`. If a request is in the middle of looping over chunks inside `app.post('/api/upload')` (`documentChunks.push`), the new chunk pushes to the array, which might be fine, but wait. When searching, `scoredChunks` loops `documentChunks`. No direct crash.

4. `app.delete('/api/documents/:source')` does:
   `const source = decodeURIComponent(req.params.source);`
   `documentChunks = documentChunks.filter(chunk => chunk.source !== source);`
   This is fine, but it leaves files in `public/documents/`? No, the files in `public/documents/` are loaded on startup. Deleting from `/api/documents/:source` only clears RAM memory. If the server restarts, they are loaded again. But that's probably expected behavior for this prototype.

Let's fix the two 🔴 issues:
1) Fix `app.post('/api/upload')` disk leak by moving `fs.unlinkSync` to a `finally` block or right after `else`.
2) Fix credential leak by sanitizing `err.message` in the catch blocks or not passing the raw Gemini error to `errorChain`.
