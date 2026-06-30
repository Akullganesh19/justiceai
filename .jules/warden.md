## 2024-05-31 — Active exposure of PII in Express Error Logs
**Data traced:** PII including emails, phone numbers, SSNs, and credit cards.
**Exposure found:** Express unhandled error handlers and specific endpoint catch blocks (like `/api/chat` and `/api/upload`) were using `console.error` to log raw `err` objects which could contain un-redacted PII from user inputs.
**Fix:** Created an irreversible regex-based log redaction format using `winston` and replaced vulnerable `console.error` calls with `logger.error` using deep cloning to prevent reference modification of live states.
**Coverage confirmed:** Reviewed `server.js` to ensure the patch applies properly to the Winston initialization and Express error routes. Verified the replacement of `console.error` with `logger.error` across chat, voice, upload, and global unhandled routes.
**Still exposed elsewhere:** The current redaction is server-side and specific to known regex patterns; manual logging elsewhere (like user prompts saved in local client history) could still retain sensitive data locally. File exports and frontend local storage may also contain unredacted data.
