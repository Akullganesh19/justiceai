## 2024-10-24 — Auto-Retry for 3rd Party APIs
**Failure point found:** External API calls to Gemini, DeepSeek, and Bhashini had no retry logic. A transient network error or 500 status would immediately bubble up as a fatal error.
**Why it existed:** The `fetch` calls in `server.js` were written with simple `await fetch(...)` wrappers directly handling requests. This is standard for happy-path development but fragile in production.
**Recovery built:** Implemented `fetchWithRetry` in `server.js`, adding a 3-attempt exponential backoff (100ms, 200ms) for network errors (`ECONNREFUSED`, `ECONNRESET`, generic fetch failures) and server errors (500+). Aborted requests are explicitly not retried.
**Blast radius before:** Any temporary API blip or network hiccup would instantly fail a user's chat or voice request, forcing them to manually retry.
**Watch for:** Similar fragility in other outbound requests (e.g., database connections if added, or if Ollama is moved off localhost).
