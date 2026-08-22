## 2024-05-18 — [Add fetchWithRetry for External AI APIs]
**Failure point found:** All external HTTP calls to Gemini, DeepSeek, Bhashini, and Ollama inside `server.js` were using raw `fetch` with no retry logic on transient failure, timeouts, or rate limits.
**Why it existed:** The backend was initially structured for a happy path, assuming external dependencies (particularly LLMs, which frequently rate limit or timeout) would always return 200.
**Recovery built:** Created `fetchWithRetry` wrapper that provides 3 exponential backoff retries for 429, 500, 502, 503, 504 and network errors (`TypeError`, `AbortError`), properly consuming bodies on transient errors and supporting dynamic AbortController generation for timeouts to prevent memory leaks and handle requests seamlessly.
**Blast radius before:** Any temporary API blip, LLM server restart, or rate limit caused an immediate hard fail leading to HTTP 500s on the client side, halting AI functionalities for users.
**Watch for:** We should check for similar unhandled database (if added later) or third-party webhooks fetch calls, or background processing jobs that might not be using this robust wrapper.
