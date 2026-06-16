## 2024-06-16 — Added Resilient API Calling Mechanism
**Failure point found:** External calls (Gemini, DeepSeek, Ollama) were made with raw `fetch` and no retry logic for transient errors.
**Why it existed:** Quick implementation of external services without built-in fault tolerance.
**Recovery built:** Added an `withRetry` wrapper using exponential backoff (up to 3 attempts). This ignores 400/401/403 errors but handles transient network hiccups and 5xx/429 errors.
**Blast radius before:** A single network blip or rate limit could cause the entire LLM chain to fail immediately, breaking the user experience.
**Watch for:** Other external fetches or unhandled DB/file operations that might also need exponential backoff.
