## 2026-06-29 — [Redacting PII in Application Logs]
**Data traced:** email, password, ssn, card_number, dob, creditcard, etc. (PII fields and raw errors).
**Exposure found:** Backend application and error logs (e.g. `console.log` for request bodies during `/api/chat`, `/api/upload`, `/api/embed`, etc.) as well as Express error handlers that leak `err.message` and `err.stack` straight to the client in JSON.
**Fix:** Added a `redactionFormatter` to Winston logger in `server.js` that deeply scrubs log payloads for known sensitive properties and masks emails/CC numbers via regex. Replaced all raw `console.*` calls with `logger.*`. Updated Express 500 error responses to return a generic 'Internal server error'.
**Coverage confirmed:** Tested the logger with a custom `.cjs` script demonstrating `email` and `password` payload reduction as well as string redaction for emails. Verified that Express error payloads now lack the raw `err.message` parameter.
**Still exposed elsewhere:** Field level access control for sensitive database queries or long-term storage backups may still need attention. Additionally, frontend network logs might retain visibility.
