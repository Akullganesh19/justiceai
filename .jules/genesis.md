## 2026-04-14 — Resilient External API Calls

**Failure point found:** 6 Unprotected third-party API fetches (Gemini, DeepSeek, Bhashini config/compute, Ollama stream/non-stream) in `server.js` lacking retry logic for transient network or 5xx/429 server errors.
**Why it existed:** Historical implementations focused on initial functionality and fast failure for error visibility without self-healing capability.
**Recovery built:** Abstracted HTTP calls to a shared `fetchWithRetry` utility with Exponential Backoff (3 attempts, doubling delay) that correctly falls back to returning the final Response to preserve existing stream handlers and caller logic.
**Blast radius before:** Any transient API glitch or rate limit (especially for third-party inference) caused immediate request termination and hard user-facing 500s or fallback chain exhaustion.
**Watch for:** Other areas of the codebase handling long-lived or stateful requests which could benefit from explicit idempotency checks before retrying.
