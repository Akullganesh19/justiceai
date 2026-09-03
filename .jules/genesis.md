## 2026-09-03 — Auto-Retry with Exponential Backoff
**Failure point found:** HTTP requests with no retry on transient failure
**Why it existed:** Native fetch wrapper didn't handle networking failures gracefully
**Recovery built:** Built `fetchWithRetry` wrapper to automatically handle transient network errors (e.g. 5xx, 429) using exponential backoff, while preventing unread response bodies from causing memory leaks.
**Blast radius before:** Complete disruption of AI services on a single temporary network blip or 429 response. High blast radius since all API features depend on these routes.
**Watch for:** Other services that interact with network requests without proper retry mechanisms.
