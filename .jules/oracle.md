## 2024-05-24 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal co-pilot for Indian citizens providing document generation, rights information, and chat capabilities.
**Prediction invented:** Anticipatory route prefetching engine that loads JavaScript chunks before the user clicks on links, triggered by `mouseover` or `touchstart` intents.
**Data used:** Browser DOM events (`mouseover`, `touchstart`) on `<a>` tags matching route paths against a centralized `routeChunks` map.
**Impact:** Users will experience near-instantaneous page transitions since the destination chunk is already being fetched while they move their cursor/finger toward the link, eliminating the initial ~400ms chunk loading delay.
**Next opportunity:** Prefetching specific document templates or rights data payloads directly from the API when users linger on category cards in the documents or rights pages.
