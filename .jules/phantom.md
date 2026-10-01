## 2024-05-24 — Request Coalescing
**Gap found:** Multiple identical API requests (like `/api/health` during mount, or duplicated API calls) hit the server independently on the frontend because native `fetch` doesn't deduplicate simultaneous requests.
**Why it existed:** Native `fetch` lacks deduplication or coalescing out of the box.
**Built:** A global `fetch` interceptor (`src/lib/coalesceFetch.js`) that caches in-flight GET requests (memoization of Promises) so identical concurrent requests resolve to the same cloned Response promise without hitting the network multiple times.
**Hot path affected:** Every GET network request on the frontend, specifically component mounts firing identical requests simultaneously.
**Measurable improvement:** Reduces duplicate network calls by sharing in-flight Response promises among callers.
**Next opportunity:** Cache-Control and stale-while-revalidate for static data like FAQs or the Glossary to completely avoid the network on subsequent navigations.
