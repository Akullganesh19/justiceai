## 2025-05-18 — [External APIs Auto-Retry with Exponential Backoff]
**Failure point found:** External API requests (Gemini, DeepSeek, Bhashini, Ollama) failed instantly on network timeouts, 5xx server errors, or 429 rate limit responses, causing chat generation and voice processing to crash and forcing the user to try again.
**Why it existed:** The backend historically relied on native `fetch` wrappers without robust transient error handling or automatic retry mechanisms logic implemented.
**Recovery built:** A `fetchWithRetry` utility using exponential backoff (100ms -> 200ms) with max 3 attempts was injected into `server.js`. The retry mechanism securely consumes 5xx HTTP response bodies to prevent socket memory leaks and handles fresh generation of `AbortSignal.timeout()` instances per retry attempt.
**Blast radius before:** 100% of LLM and Voice interactions were at risk when third-party downstream APIs experienced transient blips.
**Watch for:** Other outbound HTTP endpoints that were omitted (like specific scraping jobs, webhook integrations, etc.) that also rely on native `fetch()`.
