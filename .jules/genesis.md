## 2024-11-01 — Auto-retry with exponential backoff for external APIs
**Failure point found:** Fragile external HTTP calls in backend (Gemini, DeepSeek, Bhashini) and frontend API requests (`sendMessage` to RAG backend). These calls failed completely on brief transient network issues.
**Why it existed:** Native `fetch` does not have built-in retry logic, and error handling was limited to catching the final error rather than attempting self-healing.
**Recovery built:** Implemented `fetchWithRetry` utility with exponential backoff (up to 3 attempts) for server-side cloud integrations (Gemini, DeepSeek, Bhashini) and the client-side `sendMessage` API call. Handles 5xx, 408, 429 and network failures.
**Blast radius before:** Any temporary API downtime, network drop, or latency spike caused immediate failure for the user, resulting in a poor experience (especially during AI chat and Voice STT/TTS).
**Watch for:** Similar fragility in other third-party API calls or database connections that might be added in the future.
