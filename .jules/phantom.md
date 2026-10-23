## 2023-10-24 — Request Coalescing
**Gap found:** Identical GET requests (like health checks or config fetching) could fire simultaneously if triggered by multiple components or hooks.
**Why it existed:** Components independently called `fetch` without coordinating network state.
**Built:** A `dedupedFetch` utility in `src/lib/api-client.js` that intercepts identical in-flight GET requests and coalesces them into a single `fetch` call, returning a cloned response to all callers.
**Hot path affected:** Application initialization, voice setup, and dashboard endpoints that are polled or fetched concurrently by multiple UI elements.
**Measurable improvement:** Prevents duplicate network requests; multiple simultaneous `fetch` calls for the same URL resolve with only one actual HTTP request.
**Next opportunity:** Stale-while-revalidate caching pattern for reference data (like lists of available AI models or languages).
