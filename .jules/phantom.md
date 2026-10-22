## 2024-05-18 — Request Coalescing Added
**Gap found:** The frontend components (like voice config and health checks) were using standard `fetch` without request deduplication. Multiple identical GET requests in flight simultaneously would trigger multiple network calls.
**Why it existed:** Simplicity in early iterations where concurrent duplicate fetches weren't an issue.
**Built:** Added `dedupedFetch` wrapper in `src/lib/api-client.js` that tracks in-flight GET requests and returns the same cloned Promise to all callers.
**Hot path affected:** Initial page loads, health checks, and global component mounts that eagerly fetch reference data.
**Measurable improvement:** Reduces redundant network requests on concurrent component mounts.
**Next opportunity:** Edge caching for static data like voice config, or stale-while-revalidate for background refreshing.
