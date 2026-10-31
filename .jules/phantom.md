## 2024-05-15 — Request Coalescing
**Gap found:** No request deduplication. Multiple identical GET requests running concurrently hit the network (like multiple components fetching the same API).
**Why it existed:** Native `fetch` doesn't coalesce identical in-flight requests by default.
**Built:** Created a `dedupedFetch` wrapper and monkey-patched `window.fetch` via `setupApiClient()` in `main.jsx` to intercept identical simultaneous GET requests and return the same Promise (with cloned responses).
**Hot path affected:** Any place where multiple components independently make GET requests for the same endpoints concurrently (e.g., config, dashboards, metadata).
**Measurable improvement:** Reduces duplicate network requests on initial page loads or complex views with decoupled components.
**Next opportunity:** Edge Cache Headers to return cache-control headers on static data for client-side caching.
