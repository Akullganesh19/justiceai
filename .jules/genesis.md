## 2025-02-28 — Global Fetch Resiliency
**Failure point found:** Missing auto-retry on external `fetch()` calls in `server.js` (Ollama, Bhashini, Gemini, DeepSeek). If an external LLM API/service drops connection or timeouts temporarily, it fails hard and crashes the request. The frontend fetches also lack automated retry protection.
**Why it existed:** Native `fetch()` only fires once. Wrapping native fetch manually is tedious.
**Recovery built:** Introduced `fetchWithRetry` utility with exponential backoff for transient network issues.
**Blast radius before:** Every transient external outage resulted in a 500 error to users immediately.
**Watch for:** Other external database or API connections that might need the retry wrapper or circuit breaking.
