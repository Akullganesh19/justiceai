## 2024-05-24 — Global Fetch Interceptor

**Gap found:** Requests like `fetch('/api/health')` or `fetch('/api/voice/config')` were being triggered independently by components without deduplication, meaning multiple simultaneous identical GET requests were hitting the backend. Requests to Bhashini and Ollama endpoints didn't have global retry mechanisms on the client.
**Why it existed:** Native `window.fetch` doesn't provide built-in request coalescing, caching, or automatic retries on transient network errors.
**Built:** A global `window.fetch` interceptor `phantomFetch.js` that implements Request Coalescing (simultaneous GET requests to the same URL return the same promise), Automatic Retries (with exponential backoff up to 3 times for idempotent methods), and Request Timeouts (aborting hanging requests after 15s).
**Hot path affected:** Every single `fetch` request in the application, including UI configuration fetching, voice processing API calls, and backend health checks.
**Measurable improvement:** Saved duplicate network requests on page load (coalescing) and reduced user-facing errors on transient backend failures (retries).
**Next opportunity:** Edge caching for static reference data (like Glossary terms and Lawyer directories) to avoid hitting the backend entirely.
