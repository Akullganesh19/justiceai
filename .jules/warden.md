## 2024-05-18 — Mask IP addresses and user prompts in logs
**Data traced:** IP addresses (req.ip), User queries/prompts (latestUserMessage)
**Exposure found:** IP addresses logged in plaintext via Winston to logs/combined.log. User queries/prompts logged in plaintext to stdout via console.log in `/api/chat` endpoint.
**Fix:** Masked IP addresses (IPv4 and IPv6) in Winston logger middleware. Replaced plaintext user query snippet logging with message length in `/api/chat` endpoint.
**Coverage confirmed:** Masking logic for IP addresses in Winston logger middleware. Redacted user message snippet log in `/api/chat` endpoint in server.js.
**Still exposed elsewhere:** Other console.log outputs that may log parameters, but none appeared to log sensitive fields during the manual check.
