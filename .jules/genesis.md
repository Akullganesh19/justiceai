## 2026-08-21 — Fetch Retry with Exponential Backoff
**Failure point found:** External API calls to Gemini, DeepSeek, Bhashini, and Ollama in `server.js` had no retry mechanism. If the network blipped, the API rate limited, or a transient 5xx error occurred, the request immediately failed, resulting in a poor user experience.
**Why it existed:** The backend was initially built with straightforward async/await `fetch` calls without wrapping them in resiliency patterns.
**Recovery built:** Implemented an automatic `fetchWithRetry` utility with exponential backoff. It wraps the `fetch` calls and will retry idempotent requests up to 3 times on transient network failures or timeout errors.
**Blast radius before:** High. Any network hiccup directly impacted the end user, completely stopping the chat or summarization task they were attempting.
**Watch for:** Other third-party integrations or file uploading endpoints that might suffer from timeout errors or missing resiliency logic. Ensure that non-idempotent endpoints do not incorrectly utilize this retry wrapper.
