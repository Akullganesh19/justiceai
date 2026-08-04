## 2024-05-18 — [Global Fetch Retry Mechanism]
**Failure point found:** Native `fetch` API is used across the codebase without robust retry mechanisms for transient network failures or transient HTTP 5xx/429 errors.
**Why it existed:** Native `fetch` does not throw on HTTP error responses by default and lacks built-in retry logic, making external API calls fragile.
**Recovery built:** A global `fetch` interceptor that injects auto-retry with exponential backoff (100ms, 200ms, 400ms) for transient failures, and explicitly throws on HTTP 5xx/429 to trigger retries.
**Blast radius before:** High; a single network blip or 503 from a third-party API would cause an immediate hard failure for the user, breaking the chat experience.
**Watch for:** Other HTTP clients or external communication mechanisms that may bypass `global.fetch`.
