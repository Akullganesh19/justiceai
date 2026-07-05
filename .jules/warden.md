## 2026-07-05 — Active PII Exposure in Chat Logs
**Data traced:** User queries containing PII (SSN, Email, CC)
**Exposure found:** `server.js` logs `latestUserMessage.substring(0, 50)` in plaintext to the console, and other errors/logs could leak PII.
**Fix:** Implemented a custom Winston formatter to deep-redact PII (Email, SSN, Credit Card) from all log properties and symbols. Replaced global `console.log`, `console.warn`, and `console.error` to pipe through the redacted Winston logger so all application logs are scrubbed by default.
**Coverage confirmed:** Verified that a chat query containing an SSN and email is redacted in the logs, while regular functionality remains intact.
**Still exposed elsewhere:** Database contents, third-party analytics (if any), and full unredacted query text sent to external APIs (Gemini/DeepSeek) which is required for product functionality.
