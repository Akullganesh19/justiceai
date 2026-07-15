## 2024-05-18 — [Add fetchWithRetry wrapper for external API calls]
**Failure point found:** External API calls (Gemini, DeepSeek, Bhashini, Ollama) were using raw `fetch` with no retry logic, causing the app to crash or return empty errors on transient network failures or HTTP 5xx errors.
**Why it existed:** The original implementation assumed a perfect network and reliable external services, lacking resilience against inevitable transient failures.
**Recovery built:** Added `fetchWithRetry` wrapper around native `fetch` API. It automatically retries requests up to 3 times with exponential backoff (100ms, 200ms, 400ms) for transient failures (e.g., HTTP 5xx, network drops), while gracefully failing fast on `AbortError` or 4xx errors.
**Blast radius before:** High. A single transient network hiccup or temporary API unavailability (like a 503 from DeepSeek or timeout from local Ollama) would break the entire chat or voice feature for the user, resulting in a poor experience and forcing manual retries.
**Watch for:** Other areas where network requests or background jobs (like document indexing or PDF parsing) lack automatic retry or fallback mechanisms.
