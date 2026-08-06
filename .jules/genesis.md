## 2026-08-06 — Auto-Retry with Exponential Backoff for API Requests

**Failure point found:**
External calls to third-party LLM and translation APIs (Gemini, DeepSeek, Bhashini, Ollama) using raw `fetch()` were completely unprotected. Any transient failure (HTTP 5xx, 429) or temporary network issue would instantly crash the request and bubble up to the user as a hard error.

**Why it existed:**
The application was built assuming perfectly reliable external dependencies without consideration for transient network instability or third-party rate limits/outages.

**Recovery built:**
A global `fetch` interceptor was added in `server.js`. It wraps all `fetch()` calls and automatically retries with exponential backoff on HTTP 5xx errors, HTTP 429 Rate Limit errors, and network connection errors up to 3 times, logging a warning for each retry.

**Blast radius before:**
High frequency. Every user interaction requiring an API call was at risk of failing on a single network drop or transient downstream error, causing an unrecoverable "API Error" response on the frontend.

**Watch for:**
Database queries or background tasks that still lack retry logic. This interceptor only protects HTTP API calls made using the native `fetch` API.
