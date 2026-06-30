## 2024-06-30 — Auto-Retry for External APIs
**Failure point found:** Calls to external AI/Speech APIs (Gemini, DeepSeek, Bhashini) used `fetch` directly with no retry logic on transient errors or rate limits (429/5xx).
**Why it existed:** Original MVP logic just assumed happy paths or allowed the global error handler to return 500s when an external dependency transiently failed.
**Recovery built:** Created and implemented a `fetchWithRetry` utility using exponential backoff (100ms, 200ms, 400ms) for up to 3 attempts. AbortError is explicitly skipped to ensure intentional timeouts aren't retried.
**Blast radius before:** Any transient blip from Google, DeepSeek, or Bhashini would instantly fail a user's transcription or RAG query, forcing them to manually refresh/retry.
**Watch for:** Other `fetch` calls added later. Local Ollama calls purposefully do not use this retry logic because they handle timeouts differently and are local.
