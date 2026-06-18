## 2026-06-18 — Upload Leak & CORS Configurations

**Attacked:**
1. `app.post('/api/upload')` in `server.js` (Handling malformed files).
2. CORS middleware origin configuration (`app.use(cors(...))` in `server.js`).
3. `app.delete('/api/documents/:source')` in `server.js` (In-memory document chunk deletion path matching).

**Found:**
1. File processing logic swallowed `parsePdf` errors within a `try` block, returning early from the loop body before reaching `fs.unlinkSync()`, leaving temporary files on disk forever. Attackers could fill the disk with malformed PDFs.
2. `CORS_ORIGIN` strings like `"http://domain1.com,http://domain2.com"` were passed raw to the Express `cors` middleware, which expects exactly one origin string or an array of strings. This caused valid origins to be rejected and created invalid configurations when falling back to `*` alongside `credentials: true`.
3. The `:source` parameter in the document deletion route was not sanitized, allowing control characters or null bytes into memory.

**Severity:** 🔴 Exploitable now (Leak, CORS) / 🟡 Latent (Path Source matching)

**Fixed or flagged:**
Fixed.
- Wrapped the `fs.unlinkSync()` inside a `finally` block for `app.post('/api/upload')`.
- Parsed `process.env.CORS_ORIGIN` by splitting on commas into an array.
- Removed null bytes and control characters via a regex replace on the `source` parameter during document chunks deletion.

**Systemic pattern:**
- **Disk Leaks:** All asynchronous handlers doing temporary file processing (like `multer`) should be scrutinized to ensure cleanup runs unconditionally in a `finally` block.
- **Environment Arrays:** Look for environment configurations meant to be lists but treated as raw strings, especially in security configurations.
