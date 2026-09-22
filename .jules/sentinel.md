## 2026-09-22 — [Denial of Service via Overly Large JSON Payload]
**Attacked:** POST /api/chat
**Found:** Server crashes when receiving a JSON payload that exceeds the configured `express.json({ limit: '10mb' })`. The `body-parser` module throws a `PayloadTooLargeError` which isn't caught by a top-level error handler, crashing the entire Express process.
**Severity:** 🔴
**Fixed or flagged:** Fixed (to be implemented). Adding a top-level error handler or fixing the `app.use` to gracefully return 413.
**Systemic pattern:** Lack of global error handler for `express` parsing errors.

## 2026-09-22 — [Global Error Handling for Multer Uploads]
**Attacked:** POST /api/upload
**Found:** When uploading a file larger than `MAX_FILE_SIZE` (10MB), multer throws `MulterError: File too large`. Currently, this is logged and passed on, but it actually crashes the unhandled process stream later on or returns a 500 instead of a 413 if the payload size limit in multer is breached before parsing finishes.
**Severity:** 🟡
**Fixed or flagged:** Flagged. Requires an error handling middleware explicitly checking `err instanceof multer.MulterError`.
**Systemic pattern:** Unhandled synchronous errors from middleware crashing the Node event loop.

## 2026-09-22 — [Crash on Malformed URI component]
**Attacked:** Any route with dynamic params, specifically `DELETE /api/documents/:source`
**Found:** Express's router crashes if it tries to decode a malformed URI component, sending a 500 error and throwing an unhandled URIError causing an ugly trace that might crash the process. The memory explicitly says: "To handle malformed URI parameters (like `%`) gracefully in Express, add an error-handling middleware that specifically catches `URIError` (e.g., `if (err instanceof URIError) return res.status(400)...`) to prevent 500 Internal Server Errors."
**Severity:** 🔴
**Fixed or flagged:** Fixed (to be implemented). Adding `URIError` catching middleware.
**Systemic pattern:** Lack of global error handler for `express` URI decoding errors.

## 2026-09-22 — [Denial of Service via Overly Large JSON Payload in Embedding Endpoint]
**Attacked:** POST /api/chat
**Found:** If a user sends a valid payload just under the 10MB limit but with massive messages (e.g., `messages: [{ role: 'user', content: "a".repeat(9 * 1024 * 1024) }]`), the app routes it to the Ollama backend embeddings which may consume excessive resources or fail slowly via timeout. Currently it leads to a failover chain throwing 500 after a timeout, but tying up a worker connection.
**Severity:** 🟡
**Fixed or flagged:** Flagged. Requires strict validation on the size of the *content* strings in messages within the router or controller, before routing it to the slow embeddings processing, beyond just relying on body-parser limits.
**Systemic pattern:** Assuming payload parsing limits equal safety limits for downstream integrations.

## 2026-09-22 — [Lack of Authorization on Destructive Endpoints]
**Attacked:** DELETE /api/documents and DELETE /api/documents/:source
**Found:** These endpoints clear out the active RAG vector store chunks in-memory. They can be called anonymously without any API key or authorization, meaning anyone with access to the API server (even over CORS if configured permissively) can continuously purge the knowledge base. This is an exploit allowing data destruction / sabotage of RAG capabilities.
**Severity:** 🔴
**Fixed or flagged:** Flagged. Fix requires implementing an admin authentication middleware or token verification for these destructive endpoints, as they appear fully open to the public in `server.js`.
**Systemic pattern:** Assuming internal API endpoints are protected without explicitly enforcing it.
