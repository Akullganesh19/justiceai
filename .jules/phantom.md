## 2024-05-24 — Request Coalescing Added
**Gap found:** Unoptimized API fetches that couldn't deduplicate simultaneous identical GET requests (e.g., config fetching, health checks).
**Why it existed:** Native `fetch` does not have built-in request coalescing/deduplication out-of-the-box.
**Built:** A `dedupedFetch` wrapper in `src/lib/api-client.js` that intercepts in-flight requests and returns a cloned response to all concurrent callers for the same resource.
**Hot path affected:** Anywhere GET requests are made concurrently, particularly on initialization paths where multiple components might fetch global config or health states.
**Measurable improvement:** Reduces redundant network hits to the backend. Identical concurrent requests are coalesced into a single backend hit.
**Next opportunity:** Investigate caching layer with stale-while-revalidate for these same config endpoints to avoid hitting the network entirely after the first request.
