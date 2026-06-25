## 2024-06-25 — Added fetchWithRetry wrapper for external LLM API calls
**Failure point found:** Unprotected transient external API failures
**Why it existed:** HTTP calls to Gemini, DeepSeek, Ollama, and Bhashini lacked retry logic on failure or rate-limits.
**Recovery built:** Implemented `fetchWithRetry` auto-retry with exponential backoff for transient network and rate-limit (429/5xx) errors.
**Blast radius before:** Users received backend 500 errors or failed interactions when any underlying LLM API had transient issues.
**Watch for:** Other unprotected `fetch` calls, such as in frontend code or newly added external services.
