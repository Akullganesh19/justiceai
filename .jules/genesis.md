## 2024-08-02 — External API Call Resiliency
**Failure point found:** HTTP requests to external LLM APIs (Gemini, DeepSeek) and translation APIs (Bhashini) in `server.js` lacked any retry mechanism for transient network failures or rate limits (429/5xx).
**Why it existed:** MVP implementation used basic `fetch` without wrapper utilities, assuming happy-path network conditions.
**Recovery built:** Added `fetchWithRetry` wrapper with exponential backoff (100ms -> 200ms -> 400ms), correctly handling both network errors (e.g., `fetch failed`) and transient HTTP error statuses (429, 500, 502, 503, 504), while bypassing retries for `AbortError`.
**Blast radius before:** Any network hiccup, temporary DNS failure, or brief rate-limit from the LLM provider resulted in an immediate hard failure for the user, returning a 500 error from the backend.
**Watch for:** Other direct `fetch` usages in the frontend or other node services that haven't been wrapped in `fetchWithRetry`.
