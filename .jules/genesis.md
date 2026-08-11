## 2024-08-11 — External API Auto-Retry
**Failure point found:** All external API calls in the backend (`server.js`) to LLMs (Gemini, DeepSeek, Ollama) and Bhashini lacked resilience against transient network failures (like 5xx or 429 statuses) or temporary timeout disruptions.
**Why it existed:** The backend natively relied on standard `fetch()` API calls with one-shot execution attempts.
**Recovery built:** Implemented `fetchWithRetry` in `server.js`, wrapping the core fetch block with an exponential backoff retry mechanism specifically tuned for idempotent interactions. Includes automated dynamic timeouts to safely retry hanging calls without aborting the loop prematurely.
**Blast radius before:** Any temporary API hiccup or rate limiting on Gemini, DeepSeek, or Bhashini immediately surfaced as a hard 500 error on the backend and propagated up to the user chat UI.
**Watch for:** Other un-wrapped `fetch` operations, specifically on the frontend UI where similar transient failures on the `/api/chat` route may still occur and disrupt user flow.
