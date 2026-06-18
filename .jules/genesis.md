## 2025-06-18 — [Global Auto-Retry for External APIs]
**Failure point found:** All external fetch calls (Gemini, DeepSeek, Bhashini, Ollama) had zero retry logic. A transient 500 or network blip would immediately crash the request and bubble up to the user.
**Why it existed:** Happy-path driven development. The initial code assumed external APIs and the local Ollama instance are 100% reliable.
**Recovery built:** Created a generic `withRetry` utility utilizing exponential backoff (starting at 200ms, doubling each attempt up to 3 tries) and wrapped every `fetch` call inside `server.js` (`callGemini`, `callDeepSeek`, `/api/bhashini`, `/api/chat`). Added detailed logging for Genesis auto-recovery events so engineers can track silent healing.
**Blast radius before:** High. Any network hiccup or rate-limiting caused an immediate user-facing error and loss of context.
**Watch for:** Other areas where network calls are made without protection. Ensure the backend UI gracefully handles these transient delays.
