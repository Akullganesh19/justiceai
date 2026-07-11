## 2025-07-11 — [Auto-retry on backend chat requests]
**Failure point found:** Unprotected external HTTP call to the RAG backend in `src/lib/claudeApi.js`. When the request transiently fails (e.g. 500/502), the frontend immediately hard fails and throws an error to the user without any retry attempts.
**Why it existed:** Quick implementation of `fetch` during prototyping to connect the frontend to the backend API without robustness/resilience logic.
**Recovery built:** Added `fetchWithRetry` wrapper inside `src/lib/claudeApi.js` implementing an automatic exponential backoff (up to 3 retries).
**Blast radius before:** Any temporary network hiccup or short backend outage during chat generation would result in an immediate failure, degrading user experience.
**Watch for:** Similar unprotected external calls to third-party integrations (like directly to Ollama, Gemini or Bhashini APIs) in the backend `server.js`.
