## 2026-10-10 — PII Logging Exposure Closed
**Data traced:** PII from user chat inputs and User IP Addresses.
**Exposure found:** `server.js` logs user prompts (which can contain sensitive information such as PII and specific case details) and IP addresses in plaintext to console and potentially log files.
**Fix:** Modified `server.js` to redact `latestUserMessage` and partially redact `req.ip` in the Winston logger payload. Replaced query logging with `[REDACTED_USER_QUERY]`.
**Coverage confirmed:** The console.log statement logging `Routing query to Ollama: "[query]..."` was modified to output `Routing query to Ollama: [REDACTED_USER_QUERY]`. IP address logging in the Winston access log middleware was modified to replace the last two octets with `x.x` or default to `[REDACTED]`.
**Still exposed elsewhere:** Other areas of the frontend or external API requests might still transmit sensitive user data without full end-to-end encryption or proper scrubbing. External models (Gemini/DeepSeek) receive the unredacted prompt, which might be logged on their end depending on their data retention policies.
