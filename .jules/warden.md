## 2025-05-24 — [Active Exposure] Plaintext User Legal Query in Server Logs
**Data traced:** User Legal Queries (`latestUserMessage`) which likely contain PII, Sensitive Legal Matters, and possibly Health/Financial Data.
**Exposure found:** In `server.js` line 824, the first 50 characters of user queries were actively logged to standard output (`console.log`).
**Fix:** Replaced the predictive truncation with irreversible redaction (`[REDACTED USER QUERY]`).
**Coverage confirmed:** Read `server.js` to confirm the replacement is active for local Ollama fallback/routing.
**Still exposed elsewhere:** The Express logger middleware (`app.use` around line 190) still logs IPs and full request URLs (including query params) in plaintext without redaction. Also, multiple UI elements (ChatPage, AIChatPage) persist history and API keys to `localStorage` without a clear auto-deletion path upon logging out or explicit user data removal requests.
