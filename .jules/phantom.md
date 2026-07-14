## 2024-07-14 — Request Coalescing
**Gap found:** The frontend application made multiple identical API calls within the same page load for the same resource without deduplication.
**Why it existed:** There was no infrastructure layer to deduplicate simultaneous HTTP GET requests globally.
**Built:** A global `fetch` wrapper in `src/lib/coalescer.js` that intercepts identical in-flight GET requests, shares a single underlying network request via `AbortController` reference counting, and distributes the response to all callers simultaneously.
**Hot path affected:** Any page or component doing data fetching (e.g., config, health, or static data).
**Measurable improvement:** Reduced redundant network traffic and latency for overlapping data fetching; trackable via `window.__PHANTOM_METRICS__.coalescedRequests`.
**Next opportunity:** Implement a robust background sync and intelligent offline-first caching layer using a Service Worker for frequently read reference data (e.g. rights, glossary).
