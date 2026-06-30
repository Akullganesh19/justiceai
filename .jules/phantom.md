## 2025-02-20 — Request Coalescing Added
**Gap found:** Native `fetch` was used directly across components, leading to identical simultaneous API calls hitting the network redundantly.
**Why it existed:** Simplicity; components independently requested the data they needed (e.g., config, health checks, duplicated API actions) without a centralized network caching layer.
**Built:** Implemented `coalescedFetch` in `src/lib/utils.ts` to intercept and deduplicate identical in-flight network requests. Keyed by URL, method, headers, and body.
**Hot path affected:** All critical API paths: `/api/voice/config`, `/api/health`, `/api/chat`, and Claude API requests.
**Measurable improvement:** Reduces duplicate network calls by 100% when multiple components simultaneously request the same URL. Lowers latency during complex page loads.
**Next opportunity:** Implement a stale-while-revalidate caching pattern for reference data (like the glossary or generic legal templates).
