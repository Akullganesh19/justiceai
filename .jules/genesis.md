## YYYY-MM-DD — [Title]
**Failure point found:** Unprotected External Calls to LLM/Bhashini APIs in server.js
**Why it existed:** The backend directly uses native `fetch` for third-party API calls (Gemini, DeepSeek, Bhashini, Ollama) without robust retry mechanisms. Transient network errors, rate limits (429), or temporary 5xx errors from these services cause the requests to fail completely on the first attempt, leading to degraded user experience (e.g. chat failing to respond, TTS failing).
**Recovery built:** Implemented a `fetchWithRetry` utility in `server.js` (or a dedicated utility file) that intercepts `fetch` calls. It uses exponential backoff to automatically retry failed requests that are transient (like 429 Too Many Requests, or 500/502/503/504 Server Errors), ensuring robustness.
**Blast radius before:** Any temporary API hiccup resulted in a direct error sent to the user, halting the chat or voice translation flow. Frequent for heavily loaded APIs (like DeepSeek, Gemini free tier).
**Watch for:** Other outbound HTTP requests in frontend or other backend services that still use raw `fetch` or `axios` without error handling/retry.
