## 2024-05-24 — Request Coalescing (dedupedFetch)
**Gap found:** The frontend makes multiple identical GET requests simultaneously when different components mount and require the same data (e.g., config, user profile, reference data).
**Why it existed:** React component lifecycle and independent data fetching hooks often lead to independent parallel requests to the same endpoint during initial load or navigation.
**Built:** An invisible `fetch` interceptor (`dedupedFetch` in `src/lib/api-client.js`) that coalesces identical simultaneous GET requests by returning the same cloned Promise to all callers.
**Hot path affected:** Every single `fetch` call made by the frontend, particularly during page loads with many independent components.
**Measurable improvement:** Reduces the number of duplicate network requests, lowering server load and reducing bandwidth usage on the client. App feels faster because it's doing less redundant work.
**Next opportunity:** Implement a robust caching layer with stale-while-revalidate for data that changes infrequently.
