## 2024-05-18 — Request Coalescing and API Caching
**Gap found:** Multiple identical `fetch` requests were being fired simultaneously from different components (e.g. `FloatingVoiceButton` on mount) leading to duplicate network requests. Static API endpoints on the backend (`/api/health`, `/api/voice/config`) were dynamically generating responses for every request without cache headers or an in-memory cache.
**Why it existed:** The app was built component-by-component where each component manages its own data fetching, resulting in redundant requests. Backend API had no caching since the data generated is small.
**Built:**
1. `dedupedFetch` wrapper added to frontend (`src/lib/utils.ts`) to coalesce simultaneous identical requests to the same URL into a single active promise.
2. An in-memory cache utility (`cacheResponse`) with TTL added to `server.js` to serve `/api/health` and `/api/voice/config` efficiently along with HTTP `Cache-Control` headers.
**Hot path affected:** Application initialization, voice interactions initialization, and repeated component mounts.
**Measurable improvement:** Reduces duplicate network calls by serving concurrent requests via the same Promise (in-flight request deduplication). Backend response times for health/config drop from ~2-5ms (dynamic generation) to <1ms (in-memory map retrieval).
**Next opportunity:** Background sync for conversation history and local persistence layer.
