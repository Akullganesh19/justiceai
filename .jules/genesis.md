## 2024-05-19 — Auto-Retry for External APIs
**Failure point found:** External APIs (Gemini, DeepSeek, Bhashini, Ollama) were called directly with native `fetch()`. A transient failure, 5xx server error, or connection timeout would fail the user request immediately.
**Why it existed:** The backend was focused on functionality (getting AI responses) rather than resilience, assuming network stability and high availability of third-party APIs.
**Recovery built:** Introduced an automatic retry mechanism (`fetchWithRetry`) featuring exponential backoff (100ms -> 200ms -> 400ms) for up to 3 attempts on any 5xx or 429 response. It also handles consuming the response body on failures to avoid memory leaks and successfully regenerates timeout signals.
**Blast radius before:** Any temporary API blip, rate limit (429), or internal server error (500) at Gemini, DeepSeek, Bhashini, or Ollama caused an immediate unhandled exception, breaking the chat or document generation workflow for the active user.
**Watch for:** Other unhandled API calls, missing dead-letter queues for background jobs, and missing fallback configurations when a given model is completely down for an extended period.
