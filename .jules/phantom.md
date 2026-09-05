## 2025-05-18 — Invisible Request Coalescing Added
**Gap found:** Unoptimized network fetching allowing multiple identical simultaneous GET requests to hit the backend or network layer concurrently.
**Why it existed:** Native `fetch` lacks built-in request deduplication/coalescing for concurrent requests. React's architecture without a caching layer (like React Query or SWR) often leads to multiple components fetching the same data on mount.
**Built:** An invisible request coalescing interceptor that monkey-patches `window.fetch`. It caches the promise of in-flight requests (using URL and headers as keys) and ensures every consumer receives a cloned response so bodies can be read multiple times without throwing errors.
**Hot path affected:** Any data endpoint fetched simultaneously by multiple components on page load, or duplicated API calls within a single tick.
**Measurable improvement:** Reduces duplicate network requests on page load or parallel component rendering, lowering backend load and speeding up UI rendering.
**Next opportunity:** Background prefetching for predictive route navigation or a stale-while-revalidate client cache.
