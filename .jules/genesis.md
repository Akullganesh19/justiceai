## 2024-09-07 — Add Resilient fetchWithRetry Interceptors

**Failure point found:** External API calls to LLMs (Gemini, DeepSeek, local Ollama) and Voice processing (Bhashini) were using un-wrapped, raw `fetch()` methods in both Node.js (`server.js`) and Browser frontend code (`claudeApi.js`, `AIChatPage.jsx`).
**Why it existed:** Historically, the app treated LLM/API responses as highly reliable, lacking robust logic to retry on network blips like `ECONNREFUSED` during container restarts or temporary 500/502/503 errors from cloud providers.
**Recovery built:** Implemented `fetchWithRetry` with exponential backoff. It automatically retries requests up to 3 times for transient failures and gracefully handles `AbortController` timeout mappings, actively consuming transient response bodies to prevent memory leakage.
**Blast radius before:** Any intermittent network or backend outage caused fatal application-level errors for citizens using the local RAG chat, leading to an immediate failed response.
**Watch for:** Other unsanitized or unhandled global network requests, especially WebSocket connections or Server-Sent Events (SSE) that may not correctly handle re-connection semantics.
