## 2024-05-18 — Invisible Fetch Request Coalescing
**Gap found:** Multiple components could fire independent `fetch` requests to identical API endpoints simultaneously (e.g., configurations, health checks).
**Why it existed:** Native `fetch` lacks built-in deduplication, and isolated components were unaware of identical parallel fetches.
**Built:** `dedupedFetch` in `src/lib/api-client.js`. It wraps `fetch` to coalesce identical in-flight GET requests, mapping them to a single underlying promise and cloning the response for each caller.
**Hot path affected:** Every standard API interaction, particularly on initial render when multiple widgets mount.
**Measurable improvement:** Reduced total outbound network requests on identical endpoint loads by 100% per duplication (e.g., 5 identical GET requests become 1 network request).
**Next opportunity:** ETag-based stale-while-revalidate client-side caching for mostly-static reference data.
