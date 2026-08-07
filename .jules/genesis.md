## 2024-05-18 — Auto-Retry with Exponential Backoff for External APIs
**Failure point found:** Unprotected HTTP requests to external APIs (Gemini, DeepSeek, Bhashini, Ollama) that failed silently or threw generic errors on transient network issues/rate limits.
**Why it existed:** The backend heavily relied on the native `fetch` API without any retry logic or status code handling (native fetch doesn't throw on 429/500).
**Recovery built:** A global `fetchWithRetry` wrapper intercepting all critical external API calls, providing up to 3 automatic retries with exponential backoff (100ms -> 200ms -> 400ms), and properly throwing errors for 500/429 statuses.
**Blast radius before:** High. A single transient 500 or 429 from an LLM provider or Bhashini would completely fail the user's request (e.g., chat failure, document parsing failure, translation failure).
**Watch for:** Similar missing retries in the frontend (`src/lib/claudeApi.js` or `src/pages/AIChatPage.jsx`) and webhook receivers if added later.
