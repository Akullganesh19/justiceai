## 2024-05-24 — Request Coalescing for Fetch
**Gap found:** Multiple identical GET API calls could be fired off independently before a previous one finishes.
**Why it existed:** Native `fetch` doesn't deduplicate simultaneous requests, wasting bandwidth and connection limits on redundant data.
**Built:** A global `fetch` interceptor `initFetchCoalescer` that coalesces identical in-flight GET requests, resolving them with `Response.clone()`.
**Hot path affected:** Any component firing identical GET requests simultaneously.
**Measurable improvement:** Prevented duplicate simultaneous outgoing HTTP calls for the same URL + Headers, measurable via `window.__PHANTOM_COALESCED_COUNT`.
**Next opportunity:** Edge-caching or Service Worker background synchronization.
