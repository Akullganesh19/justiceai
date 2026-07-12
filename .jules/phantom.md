## 2024-05-24 — Request Coalescing

**Gap found:** Multiple components making independent, identical, simultaneous `fetch` GET requests to the same endpoints, duplicating work and increasing latency.
**Why it existed:** Simple component architecture where each component naturally requested the data it needed without a central data orchestrator or deduplicator.
**Built:** Global `window.fetch` wrapper that caches inflight requests based on URL and headers. If an identical request is already running, subsequent callers are attached to the existing promise and returned cloned responses. Safely aborts if all callers abort.
**Hot path affected:** Any page with multiple components loading the same data simultaneously.
**Measurable improvement:** Reduces redundant network requests significantly on concurrent component mounts.
**Next opportunity:** Stale-while-revalidate client-side caching of GET requests for reference data with high read/low write frequency.
