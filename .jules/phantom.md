## 2025-07-04 — Request Coalescing
**Gap found:** Multiple components could fetch the same endpoint independently, resulting in identical API calls being made multiple times.
**Why it existed:** The native `window.fetch` doesn't implement deduplication by default and components did not share state for these requests.
**Built:** A `coalescedFetch` wrapper injected into `window.fetch` that intercepts `GET` requests, using a `Map` to track in-flight promises (based on URL and serialized headers) and returning a cloned response for subsequent identical requests.
**Hot path affected:** Any data-fetching operation originating from frontend components (e.g. config loading, health checks).
**Measurable improvement:** Reduction in redundant identical HTTP `GET` requests sent to the backend, verifiable by observing network traffic in browser developer tools.
**Next opportunity:** Implement an intelligent Cache layer with stale-while-revalidate for data that changes infrequently.