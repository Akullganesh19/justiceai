## 2024-05-14 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal co-pilot that helps citizens understand their rights, track cases, and interact with legal intelligence.
**Prediction invented:** Implemented a predictive route prefetcher that anticipates where a user is navigating before they click. When a user hovers over or touches a link, the app instantly begins downloading the JavaScript bundle for that target page.
**Data used:** User intent signals derived from `mouseover` and `touchstart` events on `<a>` tags.
**Impact:** Perceived latency when navigating between pages (like from Landing to Chat) drops to near-zero, making the app feel instantaneous.
**Next opportunity:** Prefetching specific API data for the next logical page based on the current context (e.g. prefetching case details when hovering over a tracker card).
