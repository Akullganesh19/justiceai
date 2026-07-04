## 2026-07-04 — [Auto-Retry with Exponential Backoff added to fetch calls]
**Failure point found:** Multiple unprotected HTTP calls to third party APIs (DeepSeek, Gemini, Bhashini, Ollama) using native `fetch()`, which would fail entirely on transient errors like 429 rate limit or 5xx server issues.
**Why it existed:** Native `fetch()` only attempts requests once, leaving the node process vulnerable to transient network failures.
**Recovery built:** Wrapped all `fetch()` calls in a `fetchWithRetry` utility using exponential backoff to handle 429 and 5xx errors, gracefully yielding on explicit `AbortError` to respect abort signal timeouts.
**Blast radius before:** Any temporary API error caused full request failure, forcing users to retry actions.
**Watch for:** Ensure this utility is used if any new external APIs are introduced instead of standard `fetch`.
