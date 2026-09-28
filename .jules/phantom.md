## 2024-05-18 — Request Coalescing
**Gap found:** No request deduplication. Multiple identical GET requests made simultaneously resulted in duplicate network calls.
**Why it existed:** Native `fetch` lacks built-in request coalescing, and no caching/deduplication layer was implemented globally.
**Built:** A global `window.fetch` interceptor (`src/lib/fetchInterceptor.js`) that captures in-flight GET requests and returns a cloned promise to subsequent callers for the same URL, preventing redundant network hits.
**Hot path affected:** Any concurrent frontend API GET requests (e.g., config, health, or repeated data fetch calls during component mounts).
**Measurable improvement:** Reduced network redundancy for simultaneous identical GET requests (measurable via network tab / request logs).
**Next opportunity:** Implement a generalized stale-while-revalidate caching layer for frequently accessed, rarely changing data.