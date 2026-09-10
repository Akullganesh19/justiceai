## 2023-10-27 — Request Coalescing Interceptor
**Gap found:** The application lacked request deduplication, meaning multiple components mounting simultaneously could trigger duplicate GET requests to the same API endpoint.
**Why it existed:** Standard browser `fetch` does not automatically deduplicate simultaneous identical requests, and standard React component architecture often leads to isolated data fetching without a centralized cache.
**Built:** A `window.fetch` interceptor (`src/lib/fetchInterceptor.js`) that coalesces identical simultaneous GET requests by sharing the underlying Promise and returning cloned responses.
**Hot path affected:** All data fetching routes, especially on initial page loads or complex dashboard views where multiple widgets might request the same user or reference data.
**Measurable improvement:** Reduces redundant network overhead by returning cloned responses from a single shared Promise. Verifiable by tracking `window.__phantomStats.coalesced` in the browser console.
**Next opportunity:** Implement a stale-while-revalidate caching layer for frequently accessed, rarely changing data like glossary definitions or static templates.
