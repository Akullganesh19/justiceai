## 2026-07-15 — Request Coalescing Layer
**Gap found:** The application allowed identical API calls to be made multiple times concurrently across different components within the same page load.
**Why it existed:** Components fetched their required data independently using `fetch()` without an overarching global state coordinator or deduplication layer.
**Built:** A global `window.fetch` interceptor (`src/lib/fetchCoalescer.js`) that deduplicates concurrent identical GET requests (based on URL, method, and headers) and shares the underlying stream via `.clone()`.
**Hot path affected:** Any page load or component initialization that performs API requests, notably the RAG backend chat interactions or global config fetching.
**Measurable improvement:** Reduces duplicate concurrent network requests to 1, lowering backend load and freeing browser network connections.
**Next opportunity:** Implement an intelligent stale-while-revalidate caching layer for reference data that rarely changes.