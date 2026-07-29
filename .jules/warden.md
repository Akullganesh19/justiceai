## 2024-05-24 — Redacted Plaintext Prompts in Server Logs
**Data traced:** User Chat Prompts / Legal Contexts
**Exposure found:** `server.js` logged the first 50 characters of user chat input directly to `stdout`.
**Fix:** Modified logging in `server.js` to omit plaintext message content and only log `[REDACTED]` and the payload size metadata.
**Coverage confirmed:** Read `server.js` modifications, ran `npm run lint` and tests to ensure no breakages in chat flow.
**Still exposed elsewhere:** Local browser storage (`localStorage`) still retains complete, unencrypted chat histories, though that is confined to the client. No other sensitive server-side logging was observed during the current trace.