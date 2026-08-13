## 2024-05-25 — [Auto-Retry Mechanism for Idempotent Requests]
**Failure point found:** External API calls (LLMs, Bhashini) and client-side fetches lacked automatic retry mechanisms for transient HTTP failures (e.g., 429, 500, 502, 503).
**Why it existed:** The native `fetch` API does not automatically retry requests. Transient network errors or upstream server hiccups resulted in immediate failures.
**Recovery built:** A global `fetch` wrapper (`fetchWithRetry`) was implemented in `server.js`. It intelligently identifies idempotent operations (and specific stateless POST endpoints) and applies exponential backoff for retryable errors.
**Blast radius before:** Any network hiccup or temporary LLM API downtime caused requests to fail, leading to an unreliable user experience and error messages in the UI.
**Watch for:** Ensure that newly added non-idempotent operations (e.g., mutating database calls) are not inadvertently classified as retryable.
