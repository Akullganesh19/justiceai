## 2026-07-08 — Logger PII Redaction
**Data traced:** PII (emails, SSNs, credit cards, phones, and passwords).
**Exposure found:** Server requests, request bodies, test messages, and all active console logs (such as `/api/chat` payload) actively wrote plaintext PII and sensitive data directly to `logs/combined.log`, `logs/error.log`, and the stdout console using Winston and native Express `console.log`.
**Fix:** Created a robust `deepRedact` utility mapped to a custom `redactFormat` injected at the Winston logging layer, and overrode native `console` methods to pipe directly to Winston using deepRedact serialization before formatting.
**Coverage confirmed:** Sent dummy POST requests with raw PII (emails, passwords, SSNs) and verified that the resulting stdout logs and file outputs (`logs/combined.log`) contained securely masked patterns (e.g. `t***@example.com` or `[REDACTED]`).
**Still exposed elsewhere:** There may still be lingering unredacted logs sent to external services (like Google Analytics, or third-party vector DB APIs like DeepSeek and Gemini) when fallback mechanisms fire and contain user prompts in the request body. Also user exports and localstorage cache.
