## 2024-05-15 — [Fix Active Leak of Sensitive User Queries in Logs]
**Data traced:** User input queries directly provided in the UI chat, which can potentially contain unstructured PII.
**Exposure found:** `server.js` was actively logging the first 50 characters of user query inputs globally via `console.log(\`Routing query to Ollama: "\${latestUserMessage.substring(0, 50)}..."\`);`.
**Fix:**
- Implemented structural, irreversible redaction across all logs by introducing `redactFormat` to the `winston` logger configuration. This replaces matched PII patterns (email, SSN, credit cards) and masks sensitive object keys (`messages`, `prompt`, `password`, `text`, `token`, `audioContent`).
- Migrated manual string-based `console.log` and `console.error` logs to `logger.info` and `logger.error` using structured properties, enabling the `winston` formatter to parse and sanitize them effectively.
- Explicitly replaced the user prompt truncation log with a metadata log `{ promptLength: latestUserMessage.length }`, fully excising the query content.
**Coverage confirmed:** Reviewed logs to ensure `logger` outputs `redactFormat` correctly, verified substitution of `latestUserMessage.substring`, `req.body`, and error logging in Express route paths.
**Still exposed elsewhere:**
- Third-party endpoints (`fetch(OLLAMA_BASE_URL)`, `callGemini`) receive plaintext queries for LLM processing, which is expected functionality, but we lack audit logs indicating when/how this data is queried, exported, or deleted per-user.
- Frontend uses `console.error` on failed API requests which might unintentionally log stack traces mapping back to PII if returned improperly by the backend.
