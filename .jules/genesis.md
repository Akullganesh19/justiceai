## 2024-05-18 — [Auto-Retry for LLM and Bhashini APIs]
**Failure point found:** Raw `fetch` calls to external APIs (Gemini, DeepSeek, Bhashini, Ollama) had no auto-retry on transient network failures (like 5xx, 429, or timeouts).
**Why it existed:** Quick implementation of API integrations without built-in fault tolerance.
**Recovery built:** Created `fetchWithRetry` wrapper using exponential backoff (100ms -> 200ms -> 400ms) with proper handling for `AbortError` (timeouts) and transient network drops (`ECONNREFUSED`, `ECONNRESET`), along with dynamic abort signal regeneration per attempt.
**Blast radius before:** Any temporary network blip or rate limit would cause the chat, translation, or transcription to fail instantly, showing errors to users and requiring manual retries.
**Watch for:** Other `fetch` calls in the application, such as in the frontend (`src/`) that might lack retry mechanisms for transient errors.
