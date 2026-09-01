## 2024-05-15 — [Resilient Fetch with Exponential Backoff]
**Failure point found:** External API calls (Gemini, DeepSeek, Bhashini, Ollama) were using standard `fetch` without any retry mechanisms.
**Why it existed:** Historically, external APIs were assumed to be stable, so simple request-response was implemented to get features shipped fast.
**Recovery built:** Implemented `fetchWithRetry` auto-retry wrapper with exponential backoff and timeout capabilities to automatically handle transient network errors, server errors (5xx), and rate limiting (429).
**Blast radius before:** Any transient glitch (e.g., Gemini rate limit, DeepSeek timeout) would hard-fail the user's request and propagate a 500 to the UI.
**Watch for:** Other integrations directly utilizing `fetch` or `axios` in isolated areas.
