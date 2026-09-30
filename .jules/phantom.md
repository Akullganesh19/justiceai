## 2024-05-24 — Global Fetch Interceptor (Request Coalescing)
**Gap found:** Multiple identical GET requests were being made simultaneously (e.g. repeated fetching of static configs, reference data) without coalescing.
**Why it existed:** Native `window.fetch` was used throughout the app without any middleware to deduplicate inflight identical requests.
**Built:** A global `window.fetch` interceptor (`setupFetchInterceptor` in `src/lib/fetchInterceptor.js`) that coalesces in-flight GET requests, safely cloning responses for multiple callers, and gracefully falling back to original `fetch` for non-GET requests or requests with an AbortSignal.
**Hot path affected:** Every `fetch()` call across the entire frontend (components, hooks, pages).
**Measurable improvement:** Reduced network latency and backend load by coalescing identical simultaneous GET requests.
**Next opportunity:** Implement a background stale-while-revalidate queue for specific cached endpoints to ensure data remains fresh without blocking the UI.