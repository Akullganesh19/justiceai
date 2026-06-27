## 2024-05-19 — Unprotected Third-Party API Calls
**Failure point found:** External `fetch` calls to Gemini, DeepSeek, Bhashini, and Ollama have no retry logic. They fail immediately on transient network errors, rate limits, or short service downtimes.
**Why it existed:** The backend was likely built with a happy-path-first approach, assuming API dependencies are perfectly reliable.
**Recovery built:** Implemented `fetchWithRetry` utility with exponential backoff and configured all critical outbound HTTP requests to use it.
**Blast radius before:** Any temporary glitch in a 3rd party AI or Voice proxy caused a hard failure for the user, requiring them to manually retry their entire prompt or action.
**Watch for:** Similar unprotected internal network calls (like to the local Ollama instance if it gets overwhelmed) or missing timeouts on requests.
