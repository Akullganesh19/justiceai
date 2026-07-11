## 2024-07-11 — Global Request Coalescing
**Gap found:** The application was making independent GET requests without deduplication, meaning multiple components mounting simultaneously and fetching the same configuration or health endpoints would hit the server redundantly.
**Why it existed:** Native `fetch` lacks built-in request deduplication or coalescing, and no caching/client layer like React Query or SWR was implemented.
**Built:** A global `fetch` wrapper in `main.jsx` that intercepts GET requests. If a request is already in flight for an identical URL + headers + security context, subsequent callers share the same underlying Promise and receive cloned responses, saving network bandwidth and connection overhead.
**Hot path affected:** Any concurrent component renders that fetch identical data, such as `/api/health` or `/api/voice/config` on initial load.
**Measurable improvement:** Reduces duplicate network requests in the DevTools Network tab. Server logs will show fewer duplicate `/api/health` and `/api/voice/config` access patterns during concurrent UI component initialization.
**Next opportunity:** Implement a Stale-While-Revalidate memory cache for reference data that rarely changes, further reducing network reliance.
