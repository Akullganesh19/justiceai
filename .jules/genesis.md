## YYYY-MM-DD — Global fetch auto-retry interceptor added
**Failure point found:** External API calls (`fetch`) to Ollama, Gemini, DeepSeek, and Bhashini were unprotected and could fail on a single 429 or 5xx response without retrying.
**Why it existed:** The backend Express server relied on native `fetch` which simply returns a response object with `ok: false` for retryable HTTP errors, causing the request to fail directly instead of catching or retrying it.
**Recovery built:** Intercepted global `fetch` with an exponential backoff wrapper (up to 3 attempts). Automatically handles dynamic timeouts, cleanly aborts hanging requests, and clones body payloads to permit retrying specific idempotent and POST requests.
**Blast radius before:** Silent degradation or 500 errors on the client when a third-party API intermittently throttled or failed a request.
**Watch for:** Other manual network requests or webhook listeners that may be missing auto-retry wrappers or idempotency protections.
