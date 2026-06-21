## 2024-05-24 — [Auto-Retry for External APIs]
**Failure point found:** HTTP requests to external/third-party APIs (Gemini, DeepSeek, Bhashini, Ollama) had no retry logic on transient network or rate-limit failures.
**Why it existed:** The code used native `fetch` which fails immediately on non-200 responses or connection errors, relying on hardcoded timeouts or single-attempt failures.
**Recovery built:** Implemented `fetchWithRetry` wrapper handling 429 and 5xx errors with exponential backoff (up to 3 attempts, starting at 100ms). Replaced raw `fetch` calls in Express backend.
**Blast radius before:** Users would get immediate errors or blank UI if the network blipped or rate limits hit (common with Cloud APIs).
**Blast radius after:** Failures are transparently retried up to 3 times with backoff, significantly reducing user-facing errors.
**Watch for:** Other external dependency calls that might not use this wrapper (e.g., direct DB calls, other raw `fetch` logic in the frontend).
