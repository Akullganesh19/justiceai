## 2025-05-18 — [External API Retries]
**Failure point found:** External LLM and translation API calls (Gemini, DeepSeek, Ollama, Bhashini) lacked retry logic for transient failures (e.g., 429 Too Many Requests, 5xx Server Errors).
**Why it existed:** Native `fetch` does not throw exceptions for HTTP error status codes, leading these transient errors to cause hard failures when response parsing fails or the service hiccups.
**Recovery built:** Introduced an `async function fetchWithRetry` featuring exponential backoff (up to 3 attempts). It also safely retries POST requests by verifying the external API host to ensure idempotency.
**Blast radius before:** High. Any intermittent network flap or rate-limit spike from third-party APIs resulted in a broken user experience requiring manual retries.
**Watch for:** Other outbound HTTP calls (e.g. Supabase, internal microservices) that might be added in the future without routing through `fetchWithRetry`.
