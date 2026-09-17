## 2025-05-19 — Auto-Retry with Exponential Backoff for External APIs
**Failure point found:** External API calls to LLM providers (Gemini, DeepSeek, Ollama) and Bhashini were using raw `fetch` with no retry logic, failing outright on transient network issues, 5xx errors, or rate limits.
**Why it existed:** Quick implementation without accounting for the fragility of network boundaries or third-party service stability.
**Recovery built:** Implemented `fetchWithRetry` utility with 3-attempt exponential backoff (100ms, 200ms, 400ms). Handled memory leaks by consuming failed response bodies. Re-engineered timeout abort signals to be generated freshly per attempt to avoid instant failures on retry.
**Blast radius before:** Any external service hiccup (500, 429, timeout) caused the chat/voice request to instantly fail, presenting errors to users and breaking the workflow.
**Watch for:** Other `fetch` calls introduced over time missing this wrapper, or missing idempotency guards if we introduce POST requests that mutate data externally rather than just querying LLMs.
