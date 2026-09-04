## 2023-10-27 — Request Coalescing added to `fetch`
**Gap found:** The frontend had no request coalescing. `fetch` calls would simply hit the network directly, potentially causing duplicate requests for the same endpoints (e.g. data fetching from multiple components simultaneously).
**Why it existed:** Native `window.fetch` doesn't implement deduplication out-of-the-box. It requires a dedicated wrapper or client (like React Query or SWR), which the project lacked.
**Built:** A transparent `fetch` wrapper (`src/lib/phantomFetch.js`) that safely monkey-patches `window.fetch` on startup. It implements Request Coalescing (simultaneous duplicate GET requests share the same promise).
**Hot path affected:** Any GET request made through standard `fetch` across the entire frontend (e.g., config fetching, data loading in various pages).
**Measurable improvement:** Redundant simultaneous GET requests are eliminated (1 request goes out instead of N).
**Next opportunity:** Investigate adding intelligent background prefetching based on user hover/focus events or navigation mesh data.
