## 2025-02-28 — Global Request Coalescing & Auto-Retry

**Gap found:** The frontend application made naive network requests directly via `window.fetch`, leading to duplicated GET requests for the same resources and lack of auto-retry for transient errors on idempotent methods or LLM queries.
**Why it existed:** The native browser `fetch` API is simple but doesn't natively handle request coalescing, intelligent timeouts, or transparent retries.
**Built:** A global `window.fetch` interceptor (`phantomFetch.js`) that deduplicates simultaneous identical GET requests (Request Coalescing) and automatically retries transient failures (5xx, 429, timeouts) with exponential backoff.
**Hot path affected:** Every single API call across the frontend, notably LLM inference calls which are prone to transient timeouts or 429s, and asset fetching.
**Measurable improvement:** Zero identical simultaneous GET requests; robust LLM request completion even when the local/cloud LLM endpoint momentarily stutters or drops a connection; reduced manual user retries.
**Next opportunity:** Implement a true 'stale-while-revalidate' background caching mechanism for infrequently changing app configurations and static reference data.
