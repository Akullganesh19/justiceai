## 2024-05-18 — Route Hover Prefetching
**Product understood as:** AI-powered Legal Co-pilot for Indian Citizens containing multiple lazy-loaded SPA routes for different workflows.
**Prediction invented:** Anticipating navigation intents and prefetching route chunks when a user hovers or focuses on an internal link.
**Data used:** `mouseover`, `touchstart`, and `focusin` events on anchor (`<a>`) elements targeting internal routes.
**Impact:** Eliminates initial chunk loading latency on navigation; pages appear instantaneously because the JS is loaded while the user is still considering the click.
**Next opportunity:** Prefetching specific API data for high-traffic routes (like user dashboard stats) upon login or session start before the user even clicks to go there.