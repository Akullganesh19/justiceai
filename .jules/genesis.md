## 2026-07-22 — [Auto-Retry with Exponential Backoff for External APIs]
**Failure point found:** All external API calls in `server.js` (Ollama, Bhashini, Gemini, DeepSeek) were using raw `fetch` with no retry mechanism for transient network failures or HTTP 5xx errors.
**Why it existed:** Initial MVP implementation prioritized connecting systems rather than building robust fault tolerance.
**Recovery built:** Implemented `fetchWithRetry` utility with exponential backoff (up to 3 retries: 100ms, 200ms, 400ms) for transient 5xx, 429, and network errors. Explicitly avoids retrying `AbortError`.
**Blast radius before:** Any intermittent network blip, load balancer timeout, or momentary dependency downtime would cause a hard error and instantly disrupt a user's chat or translation session.
**Watch for:** Other isolated microservices or new external integrations that might skip this wrapper and use raw `fetch`.
