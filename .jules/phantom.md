## 2024-05-18 — [Request Coalescing]
**Gap found:** Multiple components can make simultaneous duplicate fetch requests (e.g. `fetch('/api/voice/config')` or config endpoints) independently when rendering.
**Why it existed:** Native `fetch` doesn't deduplicate inflight identical GET requests, and without a global state manager (like Redux or React Query), isolated components trigger their own lifecycle effects.
**Built:** `dedupedFetch` in `src/lib/api-client.js` to coalesce inflight identical GET requests into a single network call.
**Hot path affected:** Initial page loads, dashboard rendering, and floating voice button mounts.
**Measurable improvement:** Reduced duplicate GET requests to backend.
**Next opportunity:** Edge Cache Headers or Stale-while-revalidate client caching.
