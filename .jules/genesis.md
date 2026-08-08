## 2024-08-08 — Auto-Retry with Exponential Backoff for HTTP Requests
**Failure point found:** All critical external API calls (Gemini, DeepSeek, Bhashini, Ollama) and frontend-to-backend calls were using native `fetch` without any automatic retry mechanisms, timeouts, or exponential backoff.
**Why it existed:** Native `fetch` does not have built-in retry logic.
**Recovery built:** Created `fetchWithRetry.js` wrapper with exponential backoff (200ms -> 400ms -> 800ms etc), custom timeout support via `AbortSignal`, and idempotent safety constraints. Integrated this into all model inferences and API calls.
**Blast radius before:** Any transient network failure (e.g. temporary 5xx from Gemini or local network hiccup) immediately crashed the chat experience and forced the user to manually retry the entire request, disrupting the flow. High blast radius affecting all inference requests.
**Watch for:** Other areas of the frontend (like file uploads) that might also lack network resiliency.
