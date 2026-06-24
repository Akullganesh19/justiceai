## 2024-06-24 — Add fetchWithRetry to backend third-party calls
**Failure point found:** Unprotected third-party API calls (`fetch` calls to Gemini, DeepSeek, Bhashini, Ollama) that would fail the request immediately on any transient error or 500 response.
**Why it existed:** Quick initial implementation relying on simple network requests without fault tolerance.
**Recovery built:** Created `fetchWithRetry` in `server.js` applying auto-retry with exponential backoff on network failures, 429 rate limits, and 5xx errors. Replaced all raw `fetch` calls in `server.js` with `fetchWithRetry`.
**Blast radius before:** High. Any network hiccup or rate limit from an external LLM API caused the current request to fail entirely, returning 500 to the user.
**Watch for:** Other areas of the codebase (e.g. frontend) or other external network connections (e.g. PDF fetching if implemented) that might need similar fault tolerance.