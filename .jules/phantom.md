## 2024-11-20 — Global Request Coalescing
**Gap found:** The frontend application made naive `fetch` requests without deduplication. If multiple components loaded concurrently and needed the same configuration or data (like user profiles or API health checks), identical parallel API calls were sent to the backend.
**Why it existed:** It is typical for frontend frameworks to fetch on mount, and without a global state manager specifically designed for deduplication, each component manages its own lifecycle independently.
**Built:** A global `fetch` interceptor injected at the root (`src/main.jsx`) that coalesces concurrent identical GET requests by returning `response.clone()` for duplicate in-flight requests, avoiding redundant backend processing.
**Hot path affected:** Any initial page load or dashboard rendering multiple independent widgets querying the same endpoints.
**Measurable improvement:** Reduced parallel backend hits for identical resources by tracking an `inFlightRequests` Map, measurable by checking network tabs or backend logs for duplicate rapid-fire requests.
**Next opportunity:** Investigate adding intelligent, transparent Edge Cache Headers for static assets or predictable responses.
