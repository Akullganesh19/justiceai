## 2026-09-07 — Request Coalescing Middleware
**Gap found:** No request coalescing — 10 components each fetch the same endpoint independently, resulting in identical API calls made multiple times within one page load.
**Why it existed:** Native `window.fetch` doesn't deduplicate in-flight requests by default, and components were built independently without shared fetching infrastructure.
**Built:** Invisible `window.fetch` middleware that intercepts GET requests. If an identical request is already in-flight, it returns a clone of the original response's promise instead of firing a new network request.
**Hot path affected:** Every component that makes GET requests on mount or during identical parallel interactions (e.g., config polling, health checks).
**Measurable improvement:** Reduces redundant network requests to 0 during parallel identical fetches, decreasing server load and improving client perceived latency.
**Next opportunity:** Stale-while-revalidate caching pattern for frequently accessed, slowly changing configuration data.
