## 2024-06-22 — Fetch Auto-Retry

**Failure point found:** Unprotected third-party API calls (`fetch`) for Gemini, DeepSeek, Bhashini, and Ollama in the backend (`server.js`).
**Why it existed:** Simple `fetch` implementation without exponential backoff/retry.
**Recovery built:** Added a `fetchWithRetry` wrapper that intercepts 429/5xx and transient network errors and retries with exponential backoff up to 3 times. Respects `AbortSignal` for user-initiated cancellation.
**Blast radius before:** High. Any network hiccup, rate limit from an LLM provider, or Bhashini timeout resulted in a hard 500 error to the user without any recovery attempt.
**Watch for:** Other unhandled external dependencies like `fetch` calls in the frontend if not using a library like React Query that has built-in retries.
