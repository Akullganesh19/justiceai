## 2026-09-09 — Request Coalescing

**Gap found:** Multiple identical GET requests (e.g., config, health, redundant component API calls) hit the network simultaneously without deduplication.
**Why it existed:** The native `fetch` API doesn't deduplicate in-flight requests by default. Components triggering data fetching independently on mount led to redundant network calls for identical resources.
**Built:** An invisible `fetch` interceptor (`src/lib/phantomFetch.js`) that coalesces identical, simultaneous GET requests (without AbortSignals) into a single network call. It uses a Map to track in-flight promises, returning clones of the response to all callers.
**Hot path affected:** Any concurrent initial data fetching, configuration loading, or global state synchronization on page loads and component mounts.
**Measurable improvement:** Reduces redundant network requests. Tracked via `window.__PHANTOM_METRICS__.coalescedRequests`. Improves server capacity and reduces client network contention.
**Next opportunity:** Implement a stale-while-revalidate caching layer for frequently accessed, rarely changing data like legal glossary terms or user profiles.
