## 2023-10-27 — Request Coalescing
**Gap found:** No request deduplication. Multiple identical GET requests made simultaneously (e.g., fetching user config or reference data concurrently across components) resulted in duplicate network traffic and backend load.
**Why it existed:** Native `window.fetch` does not coalesce identical requests. Relying on simple React `useEffect` hooks across disjointed components naturally creates "thundering herd" patterns on page load.
**Built:** A global `window.fetch` interceptor (`PhantomFetch.js`) that hashes URLs and headers to generate a cache key for in-flight requests. If a request is already in-flight, subsequent callers await the same promise and receive a cloned response, completely transparently.
**Hot path affected:** Any client-side data fetching initialized on page load or bulk rendering (e.g., configuration, permissions, or reference data lookups).
**Measurable improvement:** Reduces duplicate network calls by 100% during concurrent component mounts. Lowers backend database/API hit rate and reduces client-side bandwidth and latency for the coalesced requests.
**Next opportunity:** Implement an Intelligent Cache Layer with stale-while-revalidate for reference data to further eliminate network round-trips entirely on subsequent navigations.
