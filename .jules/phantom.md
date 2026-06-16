## 2024-05-19 — Invisible Request Coalescing & Stale-While-Revalidate Caching

**Gap found:** The frontend makes naive `fetch` calls. Multiple components might fetch the same resource (like config or health checks) simultaneously, leading to redundant network traffic. There's also no client-side caching for `fetch` responses.
**Why it existed:** The app was built quickly with standard React/Vite, relying on the browser's default behavior and standard `fetch` without an intermediate caching/deduplication layer like React Query or SWR.
**Built:** An invisible infrastructure layer (`src/lib/phantom.js`) that intercepts the global `window.fetch`. It coalesces simultaneous requests for the same URL into a single promise, and implements a stale-while-revalidate caching strategy for `GET` requests.
**Hot path affected:** Any data-fetching operation, especially app startup (health checks, config) and repetitive interactions.
**Measurable improvement:** `window.__phantomStats` tracks `requestsCoalesced`, `cacheHits`, and `estimatedTimeSavedMs`. Reduced latency on repetitive reads.
**Next opportunity:** Background sync for non-critical writes (like saving chat history to the backend) or intelligent prefetching of common routes based on user behavior.
