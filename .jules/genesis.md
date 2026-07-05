## 2025-07-05 — [Added fetchWithRetry wrapper]
**Failure point found:** External API calls to Gemini, DeepSeek, Ollama, and Bhashini lacked resilience and failed immediately on transient 5xx or network errors.
**Why it existed:** The backend used native global fetch directly for all third-party integrations with no error-recovery mechanisms.
**Recovery built:** Created `fetchWithRetry` that transparently retries requests on 5xx or 429 errors using exponential backoff (up to 3 attempts).
**Blast radius before:** Any intermittent failure or brief downtime from downstream APIs immediately broke the user's RAG/chat experience.
**Watch for:** Similar unprotected HTTP requests in new backend endpoints or unhandled promise rejections inside the retry loop.
