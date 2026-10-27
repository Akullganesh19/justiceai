## 2024-10-27 — Request Coalescing Added
**Gap found:** Components naively calling `fetch()` independently, leading to identical simultaneous network calls on mount.
**Why it existed:** Simple component-level data fetching without a centralized state or caching layer.
**Built:** `dedupedFetch` wrapper in `src/lib/api-client.js` that tracks in-flight GET requests and coalesces simultaneous identical requests into a single promise.
**Hot path affected:** Component mounts that trigger identical endpoints (e.g., config checks, health pings).
**Measurable improvement:** Reduced redundant network requests for identical GET operations during simultaneous mounts or quick user interactions.
**Next opportunity:** Implement a persistent Stale-While-Revalidate caching layer on top of `dedupedFetch` for reference data that rarely changes.
