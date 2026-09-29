## 2024-05-24 — Request Coalescing (Fetch Interceptor)
**Gap found:** Multiple identical `fetch` requests happening simultaneously under load or during parallel component rendering, wasting network bandwidth and causing unnecessary wait times.
**Why it existed:** Native `fetch` lacks deduplication or coalescing out-of-the-box. React applications typically have multiple components mounting concurrently, often fetching the same config or reference data simultaneously.
**Built:** Global `fetch` interceptor `initializePhantomFetch()` that silently coalesces identical `GET` requests (by URL + headers) into a single network request, multiplexing the cloned Response to all callers.
**Hot path affected:** Any concurrent components or modules issuing identical `GET` requests within the same tick or network delay cycle.
**Measurable improvement:** Reduces duplicate network calls by $N-1$ where $N$ is the number of simultaneous callers, cutting backend load and speeding up UI rendering.
**Next opportunity:** Stale-while-revalidate client-side caching layer.
