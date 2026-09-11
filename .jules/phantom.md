## 2024-05-18 — Request Coalescing Fetch Interceptor
**Gap found:** No request coalescing — identical simultaneous GET requests were independently hitting the network, wasting throughput and causing redundant latency on components that fetch the same data at the same time.
**Why it existed:** Native `window.fetch` doesn't deduplicate parallel identical requests, and no caching or coalescing infrastructure was put in place previously.
**Built:** A globally injected `window.fetch` interceptor (`src/lib/fetchInterceptor.js`) that automatically coalesces identical simultaneous GET requests (excluding aborted ones). Waiters for the same request receive a cloned response, resolving instantly when the original resolves.
**Hot path affected:** Every component and page load fetching duplicate initial data.
**Measurable improvement:** Reduced redundant network calls; multiple duplicate requests are now consolidated into a single network operation.
**Next opportunity:** Stale-while-revalidate caching layer for immutable or rarely-changing data.
