## 2024-07-10 — Add Global HTTP Auto-Retry with Exponential Backoff
**Failure point found:** All external HTTP requests (APIs, DeepSeek, Bhashini, Ollama) and internal calls to the backend from the frontend failed silently or explicitly upon a single transient network error or 5xx server error, resulting in a broken user experience.
**Why it existed:** The native `fetch` API does not include automatic retry logic.
**Recovery built:** Intercepted global `fetch` on the server and added wrapper fetch functions on the frontend (`src/lib/claudeApi.js` and `src/pages/AIChatPage.jsx`) to include an automatic retry mechanism with exponential backoff (up to 3 attempts). This catches both network errors and 5xx responses.
**Blast radius before:** Any temporary API downtime, network blip, or rate limit caused immediate failures for the user trying to use the core intelligence features.
**Watch for:** Other forms of unhandled third-party failures like database connection drops or webhook processing errors.
