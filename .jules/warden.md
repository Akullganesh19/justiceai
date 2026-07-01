## 2024-07-01 — Sensitive Data Exposure in API Logs and Error Responses

**Data traced:** PII (Email, Phone, SSN, Credit Card) and User Inputs (`latestUserMessage`) which could contain sensitive legal context and internal server logic (`err.stack`).
**Exposure found:**
1. `console.log` in `/api/chat` printed the user's raw message plaintext, which might contain sensitive legal/personal info.
2. `console.error` logs across the app exposed raw errors and stacks.
3. Express error handlers leaked internal stack traces and `err.message` to the frontend user if `NODE_ENV === 'development'`.
**Fix:**
1. Replaced the `console.log` leaking `latestUserMessage` with a secure `logger.info` that only logs string length instead of content.
2. Rewrote Express `catch` blocks and error handlers to log errors securely via `logger.error` using Winston, instead of returning `err.message` or `err.stack` to the client as JSON responses. Always returning generic "Internal Server Error" to the client.
3. Implemented a custom Winston `redactPII` formatter using deep cloning and regex to redact common PII formats (Emails, Phone numbers, SSNs, Passwords/Tokens) from `logger` output before it reaches log files or stdout.
**Coverage confirmed:**
- The `latestUserMessage` content is explicitly removed from logs.
- Winston deep redaction safely traverses nested objects handling Dates and Errors without mutating application state.
- Checked API catch blocks. The client no longer receives detailed `err.message` or `err.stack`.
**Still exposed elsewhere:**
- Request bodies (`req.body`) might still contain unredacted data, but we intercept it at the logger layer.
- Other parts of the system might store unencrypted sensitive info in the DB/Vector memory. A deletion path for vector storage and analytics must be evaluated in a future session.
