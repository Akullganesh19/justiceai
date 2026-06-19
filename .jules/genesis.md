## 2024-06-19 — Protected External API Calls with Exponential Backoff

**Failure point found:** External `fetch` API calls (`callGemini`, `callDeepSeek`, Bhashini endpoints in `server.js`, and `sendMessage` backend calls in `src/lib/claudeApi.js`) lacked retry logic, causing them to fail completely upon temporary network issues, 5xx errors, or rate limits.
**Why it existed:** Historically, the app relied on single-attempt `fetch` calls, prioritizing simplicity over resilience, leaving zero fault tolerance for momentary third-party outages.
**Recovery built:** Implemented a `withRetry` higher-order async function with exponential backoff (`100ms * 2^(attempt-1)`) for up to 3 attempts. It differentiates between unrecoverable (e.g., 401/403) and recoverable (network/5xx) errors, allowing the app to heal silently on transient failures.
**Blast radius before:** 100% of temporary network blips or rate limits on cloud LLMs and voice services resulted in hard failures and user-facing errors.
**Watch for:** Other isolated network calls (e.g., webhook listeners, async event publishers) that may still lack retry wrappers, or non-idempotent endpoints that might be unsafe to blindly retry.
