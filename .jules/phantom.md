## 2025-07-06 — Request Coalescing Added
**Gap found:** Multiple simultaneous identical API GET requests without deduplication logic.
**Why it existed:** The native `fetch` implementation does not coalesce identical in-flight requests, and no application wrapper existed to deduplicate requests initiated synchronously by independent components or interactions.
**Built:** A `window.fetch` wrapper in `src/main.jsx` that implements transparent request coalescing for identical idempotent GET requests, utilizing a Map to store and return the cloned `Response` of in-flight promises.
**Hot path affected:** Every client-side API call throughout the frontend application.
**Measurable improvement:** Prevents duplicate network requests resulting in decreased bandwidth, connection pool saturation, and backend server load during component mounting or concurrent interactions.
**Next opportunity:** Edge/memory caching layer with TTL.
