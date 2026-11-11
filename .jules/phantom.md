## 2023-10-27 — Request Coalescing
**Gap found:** Multiple components can simultaneously make identical GET requests to the same endpoint during page load or complex interactions, leading to redundant network calls and wasted throughput.
**Why it existed:** Native `fetch` does not deduplicate requests out-of-the-box, and standard React effects trigger independently in isolated components.
**Built:** A `dedupedFetch` wrapper that intercepts `window.fetch`. It stores pending GET requests in a Map and returns the same Promise to all callers, cloning the response so each caller gets a fresh stream.
**Hot path affected:** Any GET request triggered via `fetch` across the entire application (e.g., initial data fetching, configuration loading).
**Measurable improvement:** Reduced number of outbound network requests on pages with heavy component trees; lower cumulative network latency and server load.
**Next opportunity:** Implement a Stale-While-Revalidate caching layer for reference data that rarely changes.
