## 2024-07-13 — Request Coalescing Added
**Gap found:** Uncoordinated frontend components firing duplicate concurrent GET requests for the same URLs.
**Why it existed:** Native `fetch` lacks built-in coalescing; complex component trees mount independently and trigger their own data fetching without a centralized coordinator or global caching solution like React Query.
**Built:** A global `window.fetch` wrapper that deduplicates concurrent GET requests for the same URL, sharing a single underlying network request and resolving/cloning the same response to all callers, while accurately tracking `AbortSignal` subscriber counts so that individual cancellations do not mistakenly abort the shared underlying network call unless all callers cancel.
**Hot path affected:** Page loads and component mounts where multiple independent UI elements require the same static or rarely-changing data.
**Measurable improvement:** Reduces redundant concurrent network requests, lowering both browser thread utilization and backend server load, improving overall app responsiveness without UI changes.
**Next opportunity:** Implement stale-while-revalidate caching with intelligent TTLs.
