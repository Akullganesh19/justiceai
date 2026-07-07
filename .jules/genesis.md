## 2026-07-07 — [Auto-Retry with Exponential Backoff Added]
**Failure point found:** Unprotected external API calls (Gemini, DeepSeek, Bhashini, Ollama) directly used `fetch()`. A transient failure, 429 rate limit, or 500 error would cause a permanent hard fail that crashes the user experience immediately.
**Why it existed:** The backend assumed perfect uptime for cloud and local services.
**Recovery built:** Built `fetchWithRetry` in `server.js` wrapper using exponential backoff (200ms * 2^(attempt-1)) for up to 3 attempts, including recreation of timeouts via `AbortSignal`.
**Blast radius before:** Any network hiccup or temporary cloud API error failed the active user request entirely.
**Watch for:** Other areas needing idempotent processing or circuit breaking on long-lasting down services.
