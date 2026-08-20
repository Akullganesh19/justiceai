## 2024-11-20 — Auto-Retry for External APIs
**Failure point found:** Unprotected HTTP requests to external APIs (Gemini, DeepSeek, Ollama, Bhashini) with no retry on transient failure (5xx, 429, timeouts).
**Why it existed:** Simple `fetch` wrappers were built for speed, lacking a robust transient network error handling layer.
**Recovery built:** Implemented a global `fetchWithRetry` wrapper that adds exponential backoff (up to 3 retries) and handles custom dynamic timeouts properly without premature abortion.
**Blast radius before:** 100% of network failures caused immediate, unrecoverable user-facing errors or silently crashed the pipeline.
**Watch for:** Other outbound HTTP requests in microservices or webhooks that are missing the `fetchWithRetry` wrapper, or non-idempotent endpoints wrapped without protection.
