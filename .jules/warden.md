## 2026-10-11 — [Global Console Redaction]
**Data traced:** PII (Email, Phone, Aadhaar, SSN, Credit Cards)
**Exposure found:** Server `console.log` and `console.error` logs, specific `/api/chat` route logs logging `req.body` keys and `latestUserMessage.substring(0, 50)`. Also stack traces leaking to client errors.
**Fix:** Implemented a global `console` interceptor in `server.js` that structurally redacts sensitive PII from all logs. Removed explicit vulnerable logs.
**Coverage confirmed:** Verified via grep and manual script run that logs intercept and mask appropriately.
**Still exposed elsewhere:** Client-side error boundary logs `errorInfo.componentStack` which is only visible to the user locally.
