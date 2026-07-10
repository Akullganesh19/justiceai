## 2024-05-24 — Request Coalescing Added
**Gap found:** The frontend had no request coalescing logic. Multiple components firing the exact same GET request concurrently would hit the network multiple times.
**Why it existed:** Native `fetch` doesn't deduplicate in-flight requests, and no client-side caching/deduplication layer like React Query or SWR was being used.
**Built:** A global `fetch` interceptor (`src/lib/fetchCoalescer.js`) that captures concurrent identical GET requests and returns cloned responses from a single shared network promise.
**Hot path affected:** Any page with multiple components independently fetching the same data (e.g. config, user profile, reference data) on initial load or subsequent interactions.
**Measurable improvement:** Reduces redundant network requests for identical resources by merging them into one. Lowers server load and speeds up UI rendering as all callers resolve simultaneously.
**Next opportunity:** Implement a robust client-side stale-while-revalidate (SWR) caching mechanism with TTLs to further reduce network round trips on navigation.
