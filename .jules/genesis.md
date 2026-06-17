## 2024-06-17 — [Auto-Retry for External APIs]
**Failure point found:** Unprotected external API calls using `fetch` to Gemini, DeepSeek, and Bhashini services. They were prone to failing transiently and causing hard user-facing errors without retry attempts.
**Why it existed:** The backend integration directly called these APIs without failure tolerance mechanisms like automatic backoff and retry, likely relying on standard single-try HTTP connections.
**Recovery built:** Introduced an `async function withRetry` wrapped around these specific `fetch` calls, providing up to 3 automatic retries utilizing exponential backoff (e.g., 100ms, 200ms, 400ms).
**Blast radius before:** Any transient API failure immediately terminated the request, affecting users with sudden unexpected interruptions or errors during voice processing or fallback scenarios.
**Watch for:** Other outbound HTTP requests or downstream dependencies that may be prone to sporadic network issues and could benefit from similar resiliency mechanisms.
