## 2024-10-16 — Request Coalescing Added
**Gap found:** The frontend had no request deduplication or coalescing, meaning multiple components requesting the same API endpoint simultaneously would result in redundant network requests.
**Why it existed:** Native `fetch` does not coalesce requests by default, and components (e.g. standard React patterns) frequently trigger parallel requests without a shared cache manager.
**Built:** A transparent request coalescing interceptor for `window.fetch`. It intercepts GET requests and stores in-flight promises based on a stable cache key (URL + headers). Concurrent requests for the same key await the identical shared promise and are served a cloned response stream, effectively reducing N identical simultaneous requests to 1.
**Hot path affected:** Any simultaneous parallel data fetching on page loads or complex multi-component renders.
**Measurable improvement:** Reduces duplicate network traffic. A test verified that 3 concurrent fetch requests to the same URL result in exactly 1 actual network call.
**Next opportunity:** Background sync queues to handle non-critical writes and mutations optimally.
