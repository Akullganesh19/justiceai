
## 2024-05-18 — [Global Fetch Auto-Retry]
**Failure point found:** 6 critical third-party/external API integrations (Ollama, Bhashini, Gemini, DeepSeek) using generic `fetch` with no protection against transient network errors or rate limits.
**Why it existed:** The backend was initially built to assume stable network connections for all 3rd party AI dependencies.
**Recovery built:** Intercepted all `fetch` calls in `server.js` using a custom `fetchWithRetry` wrapper that implements exponential backoff (100ms, 200ms, 400ms) with a max of 3 attempts for 429 and 5xx errors, while instantly re-throwing AbortErrors (timeouts) and avoiding infinite recursion.
**Blast radius before:** High. Any network hiccup or temporary rate limit on a model provider would instantly fail the entire AI feature with a 500 status directly surfaced to the user.
**Watch for:** Ensure we do not wrap inherently non-idempotent endpoints or local disk operations with retry without an idempotency key.
