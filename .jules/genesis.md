## 2024-09-05 — [Auto-Retry for External APIs]
**Failure point found:** Unprotected external API calls (Gemini, DeepSeek, Bhashini, Ollama) using raw `fetch` with no retry logic on transient network errors (e.g. `ECONNREFUSED`, 5xx, 429).
**Why it existed:** The backend assumed perfect network conditions and third-party API reliability, causing direct failures for users on temporary outages.
**Recovery built:** Implemented `fetchWithRetry` in `server.js` wrapping all external LLM and external utility calls. Adds exponential backoff (up to 3 attempts) for transient errors, while correctly propagating `AbortError` (client timeouts).
**Blast radius before:** Any network hiccup or temporary rate limit caused immediate user-facing request failure.
**Watch for:** Similar raw HTTP calls if new providers are added, or if frontend clients begin polling aggressively without matching client-side backoff.
