## 2025-02-23 — Request Coalescing Added
**Gap found:** The frontend `fetch` API was used naively. Identical API requests triggered simultaneously by multiple components (e.g., config, user profile, reference data) would result in multiple network calls, wasting throughput and slowing down rendering.
**Why it existed:** Native `fetch` does not automatically deduplicate concurrent requests. Components were written in isolation without a centralized data-fetching layer to coordinate inflight requests.
**Built:** A transparent request coalescing wrapper around `window.fetch`. It intercepts calls, checks an `inFlight` Map for identical GET requests, and returns cloned responses.
**Hot path affected:** Application initialization and any multi-component mount where components fetch the same configuration or baseline data simultaneously.
**Measurable improvement:** Reduces the number of duplicate outgoing network requests during concurrent component mounting (requests saved), lowering backend load and speeding up time-to-interactive.
**Next opportunity:** Implement an intelligent Edge Cache or Stale-While-Revalidate caching pattern for reference data that rarely changes.