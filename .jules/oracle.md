## 2024-05-24 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal co-pilot that helps citizens understand rights and generate documents. Navigation across the app's many tools is frequent.
**Prediction invented:** Behavioral Route Prefetching that detects user hover or touch proximity towards links and dynamically loads the underlying React route chunk before the click event fires.
**Data used:** Browser pointer proximity events (`mouseover`, `touchstart`) targeted on internal `<a>` tags.
**Impact:** Eliminates the ~400ms network fetch latency associated with typical lazy loading. When the user ultimately clicks the link, the view transitions with near zero latency (~50ms perceived).
**Next opportunity:** Predicting form defaults based on past local storage (e.g., auto-setting the jurisdiction/state).
