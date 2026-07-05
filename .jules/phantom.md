## 2024-07-05 — Request Coalescing

**Gap found:** The frontend app lacked request deduplication (coalescing) for identical network fetches. If multiple components requested the same data at the same time, it resulted in redundant network calls.
**Why it existed:** Native `fetch` does not coalesce by default; each component making a request manages its own independent lifecycle unless specifically brokered through a global state manager or custom wrapper.
**Built:** An invisible fetch wrapper in the global entry point (`src/main.jsx`) that intercepts `window.fetch`. It checks a Map (`inFlight`) for identically signatured GET requests (by URL and Headers) and, if one is pending, returns a cloned Promise of the underlying response.
**Hot path affected:** Anywhere multiple components render concurrently and request overlapping data (like reference configs, or initial state loads).
**Measurable improvement:** Reduces duplicative GET requests to exactly 1 per resource within the time it takes the network call to return. Reduces network latency and back-end load without user intervention.
**Next opportunity:** Investigate stale-while-revalidate caching headers for static assets, or connection pooling improvements in the backend server.
