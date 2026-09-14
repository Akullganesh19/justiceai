## 2024-05-24 — [fetchWithRetry Auto-Retry Wrapper]
**Failure point found:** Unprotected external HTTP calls (`fetch`) to LLM and TTS providers (`Ollama`, `Gemini`, `DeepSeek`, `Bhashini`) with no retry logic on transient network or 5xx failures.
**Why it existed:** Naive fetch implementation without network resilience or exponential backoff in `server.js`.
**Recovery built:** Exponential backoff auto-retry wrapper (`fetchWithRetry`) that intercepts 5xx errors and network failures, consuming error bodies to prevent socket leaks, and gracefully handles client disconnects (`AbortError`).
**Blast radius before:** Any transient network error or API blip immediately failed the request or cascaded into the next fallback, eventually failing the entire chat or voice inference endpoint for the user.
**Watch for:** Future integrations or other endpoints that introduce new `fetch` calls without utilizing the auto-retry wrapper.
