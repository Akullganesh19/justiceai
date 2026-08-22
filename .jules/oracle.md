## 2025-02-27 — Predictive Navigation Mesh
**Product understood as:** An AI-powered legal co-pilot and document generator that users navigate through various interconnected tools (chat, estimator, case tracker).
**Prediction invented:** Predictive Navigation Mesh - an invisible component that anticipates user navigation and prefetches route code/data before they click. It uses two methods: Intent Prediction (prefetching on hover) and Behavioral Prediction (building a statistical sequence graph of user navigations to prefetch the most likely next route based on historical patterns).
**Data used:** Anchor hover events (intent signal) and `localStorage` `oracle_nav_graph` (behavioral signal tracking transitions between routes).
**Impact:** Perceived loading times for likely next pages drop to near-zero as code chunks are fetched predictively in the background. Degrades gracefully to normal loading on cache miss.
**Next opportunity:** Predicting likely document types to draft based on the user's recent chat history context.
