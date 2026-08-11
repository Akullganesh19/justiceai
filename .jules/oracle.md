## 2024-05-19 — Predictive Route Chunk Prefetching
**Product understood as:** An AI-Powered Legal Co-pilot application for Indian Citizens built in React, likely functioning as a multi-page app (using React Router).
**Prediction invented:** A centralized route chunk mapping combined with global passive event listeners (`mouseover` and `touchstart`) to detect when a user is likely intending to navigate to a new route. This preemptively fetches the associated JS chunks for that page route before the actual click event occurs.
**Data used:** The existing behavior of users hovering or tapping on links before navigation.
**Impact:** A significant reduction in perceived latency when navigating between lazily-loaded routes. The time a user spends hovering over a link is utilized to download the code, making the transition feel instantaneous when the click happens.
**Next opportunity:** Investigate preemptively calling APIs when navigating to pages that heavily rely on standard data fetching (e.g., pre-fetching case history or lawyer lists before route transition finishes).
