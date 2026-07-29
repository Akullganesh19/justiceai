## 2024-05-24 — Predictive Route Prefetching
**Product understood as:** An AI legal co-pilot (SPA) utilizing lazy-loaded route chunks for features like chat, document generation, and estimators.
**Prediction invented:** Predictive route prefetching on hover. When a user hovers over a link, we anticipate their click and proactively load the JavaScript bundle for the target route before they actually click, dramatically reducing perceived latency.
**Data used:** User's cursor behavior (hovering/moving toward a link via `mouseover` event).
**Impact:** Nearly instantaneous page transitions. A process that typically takes 200-400ms (fetching the chunk over network) now happens concurrently with the user's decision-to-click process, resulting in ~0-50ms perceived load time when they finally click.
**Next opportunity:** Predictive prefetching of chat history data on login, or predictive defaults for the estimator form based on previous entries.
