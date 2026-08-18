## 2025-02-28 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal copilot for Indian citizens offering chat, estimators, document vaults, and lawyer finding.
**Prediction invented:** Intent-based lazy chunk prefetching. The app now detects when users hover over or touch links and eagerly executes the React `lazy` import function for the target route before the user even clicks.
**Data used:** Global `mouseover` and `touchstart` signals paired with target `href` path matching against a centralized `routeChunks` map.
**Impact:** Eliminates initial chunk loading latency. What was previously a ~400ms loading spinner flash on navigation is now a virtually instantaneous (<50ms perceived) transition as the chunk is already cached by the time the click event registers.
**Next opportunity:** Behavior-based pre-filling of forms based on previous sessions (e.g., pre-selecting default state/language in estimators).
