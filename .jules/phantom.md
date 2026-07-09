## 2026-07-09 — Request Coalescing
**Gap found:** Identical API calls made multiple times within one page load, wasting bandwidth and latency.
**Why it existed:** Components independently fetch the same data without a shared cache or request deduplication layer.
**Built:** A global `fetch` wrapper that coalesces concurrent identical GET requests into a single network request.
**Hot path affected:** Any simultaneous GET requests across the app, especially during parallel component mounting.
**Measurable improvement:** Reduced number of outbound network requests; lower cumulative latency for duplicate data requests.
**Next opportunity:** Intelligent Cache Layer with stale-while-revalidate for reference data.
