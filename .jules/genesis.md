## 2024-07-03 — [Genesis: Auto-Retry with Exponential Backoff for API Calls]
**Failure point found:** All external fetch API calls in the backend (`callGemini`, `callDeepSeek`, Bhashini endpoints `/config` and `/compute`, and Ollama endpoints) lacked retry mechanisms and failed completely on transient errors or rate limits.
**Why it existed:** The backend used plain `fetch` calls which treat any non-OK HTTP status or network failure as an unrecoverable error leading directly to user-facing failure.
**Recovery built:** Added a global `fetchWithRetry` utility in `server.js` that implements exponential backoff (up to 3 attempts, with 100ms * 2^attempt delay). It automatically retries on 429 (Rate Limit) or 5xx (Server Error) status codes and handles `AbortError` seamlessly. Replaced all raw `fetch` calls with `fetchWithRetry`.
**Blast radius before:** 100% of temporary API hiccups, network stutters, or 429 rate limit responses led to instant application error outputs or service degradation for all users making requests.
**Watch for:** Other direct network bindings across the application that might still be throwing raw errors without attempting transient failure recovery.
