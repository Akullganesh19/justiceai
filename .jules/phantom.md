## 2024-05-29 — Request Coalescing Added
**Gap found:** No request coalescing — identical API calls made multiple times within one page load resulted in wasted network bandwidth and latency.
**Why it existed:** Naive usage of native `fetch` across isolated React components.
**Built:** Global `coalescedFetch` replacement wrapper in `src/lib/utils.ts` that deduplicates identical concurrent GET requests into a single network call.
**Hot path affected:** Any data-fetching operation on page load where multiple components request the same config, user profile, or reference data.
**Measurable improvement:** Reduces the number of duplicate network requests to 1 per resource.
**Next opportunity:** Stale-while-revalidate caching pattern for frequently read but rarely updated reference data.
