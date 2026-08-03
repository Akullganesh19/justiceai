## 2024-08-03 — Auto-Retry for External Dependencies
**Failure point found:** Unprotected HTTP requests to external APIs (Gemini, DeepSeek, Bhashini) and from the frontend to the backend that fail silently or break immediately on transient errors (5xx, 429, fetch failed).
**Why it existed:** Native `fetch` was used without any wrapper, meaning single network blips or rate limits caused hard crashes or broke the chat experience.
**Recovery built:** Implemented `fetchWithRetry` with exponential backoff (200ms -> 400ms -> 800ms) that explicitly retries on native network errors and HTTP status 429/5xx, while properly propagating `AbortError` and sanitizing logged URLs.
**Blast radius before:** High. Any network instability with 3rd party providers or between the client and server immediately crashed the user's current interaction.
**Watch for:** Other background tasks or webhooks that might not use this wrapper and still depend on raw `fetch`.
