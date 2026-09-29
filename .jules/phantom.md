## 2024-05-19 — Global Fetch Coalescer
**Gap found:** Multiple identical API requests were being fired simultaneously within single page loads because components requested the same endpoints independently without orchestration.
**Why it existed:** It is typical for isolated React components to independently manage their own fetch lifecycle without shared state.
**Built:** A global `window.fetch` interceptor (`initFetchCoalescer`) that deduplicates identical, in-flight GET requests and returns cloned responses to all callers.
**Hot path affected:** Initial page loads, frequent API reads, and component mount bursts.
**Measurable improvement:** Reduces duplicate network round-trips for the exact same data to 1, heavily saving throughput and connection latency.
**Next opportunity:** Investigate implementing an edge caching layer or intelligent background synchronization for heavily read data like user profile configs.
