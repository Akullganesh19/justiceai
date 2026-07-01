## 2025-02-28 — Auto-Retry for External Dependencies
**Failure point found:** External HTTP calls (Gemini, DeepSeek, Bhashini, Ollama) using raw `fetch` had no protection against transient network errors or rate limits (429/5xx).
**Why it existed:** Native `fetch` is the default method for HTTP calls, but it doesn't have built-in retry logic.
**Recovery built:** Created `fetchWithRetry` wrapper with exponential backoff (up to 3 retries) and explicit handling for `AbortError` (timeout cancellations). All vulnerable `fetch` calls in `server.js` were replaced.
**Blast radius before:** Any transient network blip, load balancer error, or 429 rate limit would cause an immediate hard failure, breaking chat responses, voice transcription, or document embedding for the user.
**Watch for:** Other microservices or future integrations adding raw `fetch` calls without utilizing the new `fetchWithRetry` wrapper.
