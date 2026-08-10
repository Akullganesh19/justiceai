## 2024-05-18 — External API Calls Lacked Auto-Retry
**Failure point found:** External API calls to Gemini, DeepSeek, Bhashini, and Ollama were not protected against transient network failures or HTTP 500/502/503/504/429 errors.
**Why it existed:** Historically, simple `fetch` was used without any retry wrappers.
**Recovery built:** Created `fetchWithRetry` wrapper inside `server.js` implementing exponential backoff.
**Blast radius before:** Users would experience immediate failures and generic error messages when any LLM or Voice API briefly hiccuped.
**Watch for:** Other external HTTP requests in new features that might use standard `fetch` directly instead of the retry mechanism.
