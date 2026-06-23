## 2026-06-23 — Add fetchWithRetry mechanism

**Failure point found:** Raw `fetch()` calls in `server.js` (for Gemini, DeepSeek, Bhashini, and Ollama) with no retry logic for transient HTTP errors or timeouts.
**Why it existed:** A basic implementation of API routing did not account for network latency, temporary 500/502/503 errors, or 429 rate limit statuses from upstream APIs.
**Recovery built:** A `fetchWithRetry` utility using exponential backoff (500ms, 1000ms, 2000ms) was created and wrapped around all third-party API calls.
**Blast radius before:** Any temporary API error instantly dropped the user's request and could lead to silent UX failures or immediate 500 status returns to the client.
**Watch for:** Other areas of the frontend or backend where raw HTTP requests or unhandled fetch operations could fail silently without a robust retry implementation.
