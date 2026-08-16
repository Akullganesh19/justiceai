## 2024-08-16 — Auto-Retry for External API Requests
**Failure point found:** External calls to LLMs (Gemini, DeepSeek, Ollama) and Bhashini API used raw `fetch()` calls without any auto-retry or backoff on transient network failures or rate limits.
**Why it existed:** Assumed happy-path network communication with external APIs.
**Recovery built:** Added `fetchWithRetry` wrapper that intercepts failed requests (status code >= 500 or 429) and network errors, and retries up to 3 times using exponential backoff (100ms, 200ms, 400ms). Also dynamically recreates `AbortController` timeouts for each retry attempt instead of reusing a static `AbortSignal.timeout`.
**Blast radius before:** Any temporary API downtime, rate limiting, or brief network hiccup resulted in an immediate 500 error returned to the user or broke the background chat/voice flow.
**Watch for:** Other outbound HTTP calls using `fetch()` without a retry wrapper, or non-idempotent operations that are unsafely retried (though these APIs act essentially idempotently).
