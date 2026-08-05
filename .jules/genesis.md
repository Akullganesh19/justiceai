## 2024-05-18 — External API Auto-Recovery
**Failure point found:** External cloud APIs (Gemini, DeepSeek, Bhashini) were called via raw `fetch` with no retry logic, meaning transient network failures, 429 Rate Limits, or 502/503/504 errors would immediately break the user experience and return an error to the frontend.
**Why it existed:** Quick initial implementation that assumed the 'happy path' for network requests.
**Recovery built:** Built `fetchWithRetry` wrapper with Exponential Backoff (3 attempts: 200ms -> 400ms -> 800ms) for rate limits and server errors. Replaced bare fetch calls for all external APIs in `server.js`.
**Blast radius before:** Any intermittent network blip on Cloud AI endpoints caused the user's RAG request or Voice transcription to fail instantly, requiring the user to manually retry.
**Watch for:** Other outbound HTTP requests in node/frontend that might be missing retry logic.
