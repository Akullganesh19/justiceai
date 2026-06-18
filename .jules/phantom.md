## 2024-06-18 — [Request Coalescing & Intelligent Caching]
**Gap found:** The frontend utilized naive, native `fetch` calls across components resulting in un-deduplicated network requests. Identical simultaneous requests to the same endpoint triggered duplicate network traffic, and GET requests were not cached or revalidated.
**Why it existed:** Simplicity; direct wrapper and usage of native `fetch` API without a robust custom networking layer.
**Built:** An intelligent API layer (`phantomFetch`) that implements request coalescing for identical simultaneous requests and a stale-while-revalidate caching mechanism for GET requests.
**Hot path affected:** General API usage, especially during simultaneous component mounts or redundant user actions (e.g., config polling, duplicate POST retries).
**Measurable improvement:** Reduced redundant network traffic during concurrent component mounts. Users will feel the app is snappier and latency is effectively zero on cached configuration / health check GET requests.
**Next opportunity:** Investigate Edge Caching strategies, offline Service Worker, or Optimistic UI Updates for mutations.
