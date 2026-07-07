## 2024-XX-XX — Request Coalescing Added
**Gap found:** Components could make identical, simultaneous API calls. `fetch` lacked any coalescing or deduplication wrapper.
**Why it existed:** Native `fetch` behaviour doesn't deduplicate overlapping requests by default; React components were directly using it.
**Built:** A globally applied `window.fetch` wrapper in `main.jsx` that deduplicates simultaneous in-flight GET requests and returns a cloned response.
**Hot path affected:** Any concurrent components making the same API requests during render, specifically GET requests.
**Measurable improvement:** Prevented duplicate overlapping network requests by storing in-flight promises and handing clones to parallel callers.
**Next opportunity:** Investigate frontend response caching using stale-while-revalidate or intelligent optimistic UI updates for writes.
