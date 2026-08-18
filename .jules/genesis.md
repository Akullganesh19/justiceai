## 2025-05-24 — [Auto-Retry with Exponential Backoff for External APIs]
**Failure point found:** Unprotected HTTP calls to external LLM providers (Gemini, DeepSeek, Ollama, Bhashini) via standard `fetch`.
**Why it existed:** The native `fetch` API does not automatically retry requests, even on retryable transient network errors like 429 (Too Many Requests), 502 (Bad Gateway), 503 (Service Unavailable), or 504 (Gateway Timeout).
**Recovery built:** A `fetchWithRetry` wrapper function that intercepts requests and retries failing idempotent requests (and stateless POST requests to specified LLM endpoints) up to 3 times with exponential backoff.
**Blast radius before:** Any intermittent failure from external APIs caused a hard fail that bubbled up to the user, breaking the chat or processing feature silently or displaying a cryptic error message.
**Watch for:** Similar raw `fetch` calls added in the future that bypass this wrapper.
