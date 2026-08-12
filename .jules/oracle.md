## 2025-05-18 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal co-pilot that provides tools and resources to Indian citizens (e.g., chat, case tracking, documents). It uses lazy-loaded React routes to keep bundle sizes small.
**Prediction invented:** Predictive route prefetching. Instead of waiting for a user to click a link (triggering a slow network request for the route chunk), the app now listens for `mouseover` and `touchstart` events on links, predicts the user's intent to navigate, and invokes the lazy-load import function dynamically in the background.
**Data used:** User hover/touch intent on navigation links, matched against a deterministic path-to-chunk map (`routeChunks`).
**Impact:** Perceived loading times for subsequent pages will drop drastically (near-instant page transitions), as the route chunk is often fully downloaded before the physical `click` event fires.
**Next opportunity:** Behavior-based predictive prefetching. For instance, if a user finishes the "Estimator", automatically prefetch the "Lawyer Finder" or "Case Tracker" logic under the assumption that they will need to act on the estimate next.
