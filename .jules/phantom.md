## 2024-05-18 — Request Coalescing
**Gap found:** Multiple React components could simultaneously trigger `fetch` calls to the same endpoint (e.g., config, health, chat) on mount, leading to redundant network traffic and unnecessary backend load.
**Why it existed:** Standard `fetch` does not deduplicate simultaneous in-flight requests.
**Built:** Created `dedupedFetch` in `src/lib/api-client.js` that tracks in-flight GET requests and returns a cloned response to all callers, preventing duplicate network calls.
**Hot path affected:** Initialization calls in Voice Button and Intelligence Selection Terminal, and any future GET requests.
**Measurable improvement:** Reduces duplicate GET requests by coalescing them into a single call, saving network bandwidth and reducing backend latency.
**Next opportunity:** Investigate implementing an intelligent caching layer for infrequently changing endpoints.
