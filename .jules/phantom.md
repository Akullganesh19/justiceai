## 2024-05-22 — Request Coalescing
**Gap found:** No API client layer, frontend components call `fetch` directly causing duplicated calls for identical API requests.
**Why it existed:** Quick implementation using native browser APIs without considering concurrent identical requests across components.
**Built:** A central `dedupedFetch` API client with request coalescing for identical GET requests.
**Hot path affected:** Any concurrent GET requests across components for the same data (like `/api/health` or config fetching in voice/chat pages).
**Measurable improvement:** Reduces the number of duplicate network requests for identical simultaneous `fetch` calls.
**Next opportunity:** Investigate Edge Caching or Background sync for chat messages.
