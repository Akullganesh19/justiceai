## 2026-07-21 — Route Chunk Prefetching

**Product understood as:** A React-based single-page AI legal co-pilot (JusticeAI) application with many interactive pages, utilizing React Router and lazy-loaded route chunks to segment the bundle sizes.

**Prediction invented:** A centralized route prefetching engine that loads the dynamic Javascript chunks for lazily-loaded routes into memory the moment a user moves their mouse over a link pointing to that route, predicting their next action.

**Data used:** The existing `lazy` components initialization mappings combined with live DOM `mouseover` events specifically matching anchor elements (`<a>`) with internal URLs.

**Impact:** By preloading the code just milliseconds before the click registers, the React router transitions instantly. The user perceived application latency drops to near zero as the "INITIALIZING_SYSTEM_CORE..." loader fallback will almost never have to be shown for chunk-loading operations.

**Next opportunity:** Expand prefetching logic beyond static route chunks to intelligent background API requests predicting what data the user will need next when visiting that page (e.g., prefetching case tracker status if they hover the case tracker route).