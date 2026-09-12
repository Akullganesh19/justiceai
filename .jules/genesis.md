## 2024-06-25 — Auto-retry for external API calls
**Failure point found:** All external API calls in `server.js` (Ollama, Gemini, DeepSeek, Bhashini) used native `fetch` with no retry logic on transient network or server errors.
**Why it existed:** Initially written for the happy path and local reliability without expecting network partitions or rate limits.
**Recovery built:** Created `fetchWithRetry` wrapper that catches transient errors (500s, 429s, ECONNRESET) and automatically retries up to 3 times with exponential backoff before bubbling up the failure.
**Blast radius before:** Any temporary blip on external services directly resulted in an HTTP 500 error to the user and a broken experience.
**Watch for:** Other services (e.g. database connections, though currently non-existent) or non-idempotent operations needing strict retry boundaries.
