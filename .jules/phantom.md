## 2024-06-16 — Request Coalescing and Intelligent Caching
**Gap found:** Naive network layer making identical HTTP GET requests independently, blocking component rendering or wasting bandwidth on data that rarely changes (like `/api/health` and `/api/voice/config`).
**Why it existed:** Default `fetch` implementation without a centralized network abstraction or state management library to deduplicate and cache readonly queries.
**Built:** A coalescing cache layer (`src/lib/fetchUtils.js`) providing `fetchWithCache`. It dedups concurrent requests and caches responses using a stale-while-revalidate pattern with a 60s TTL.
**Hot path affected:** UI initialization, floating voice button instantiation, and API connectivity health checks.
**Measurable improvement:** Simultaneous component renders requiring the same remote state will only trigger a single network call. Subsequent identical requests within 60 seconds are served instantly from memory without blocking.
**Next opportunity:** Background sync queue for non-critical telemetry and persistence operations (e.g., saving user history).
