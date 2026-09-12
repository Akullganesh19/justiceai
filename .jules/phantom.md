## 2024-05-17 — Fetch Request Coalescing
**Gap found:** No request coalescing for identical API calls made simultaneously by multiple components.
**Why it existed:** Native `window.fetch` does not deduplicate requests.
**Built:** A global `window.fetch` interceptor (`src/lib/fetchInterceptor.js`) injected early in `src/main.jsx`. It intercepts GET requests and returns a shared promise for identical concurrent requests (matching URL and headers).
**Hot path affected:** Anywhere multiple components request the same data on mount or navigation (e.g., config, health, or user settings endpoints).
**Measurable improvement:** Reduces duplicate network requests when rendering complex views or layouts.
**Next opportunity:** Implement a robust edge cache layer with stale-while-revalidate for static config data.
