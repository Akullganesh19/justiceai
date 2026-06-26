## 2024-05-19 — Added fetchWithRetry for robust external API calls
**Failure point found:** External API calls (Gemini, DeepSeek, Bhashini, Ollama) had no retry logic.
**Why it existed:** Simple `fetch` was used without handling transient network errors or rate limits (429/5xx).
**Recovery built:** Added `fetchWithRetry` with exponential backoff and explicit `AbortError` handling.
**Blast radius before:** Any transient API failure would cause the request to fail entirely, resulting in an error shown to the user or silent failure.
**Watch for:** Other external dependencies or SDKs that might not have built-in retry mechanisms.
