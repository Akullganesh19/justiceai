## 2024-05-24 — [Express Server Error Leakage]
**Attacked:** Global Error Handler, Chat, Voice, and Upload Express endpoints
**Found:** Explicitly returned raw `err.message` and `err.stack` (in dev) to clients as JSON when an internal exception occurred.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Replaced dynamic `err.message`/`err.stack` payloads with static generic `"Internal Server Error"` messages to prevent leaking internal configurations, dependencies, or sensitive paths.
**Systemic pattern:** This is a common Express anti-pattern where developers forward unhandled exception text directly to frontend clients.
