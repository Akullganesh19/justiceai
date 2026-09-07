## 2024-05-24 — Predictive Navigation Mesh
**Product understood as:** JusticeAI, an AI-powered legal co-pilot for Indian citizens, featuring multi-page interactions (chat, documents, dashboard, estimator).
**Prediction invented:** Predictive Route Prefetching via a Navigation Mesh. The app tracks the probabilities of sequence behavior ("if they are on page X, they usually go to page Y next") and automatically begins downloading the JavaScript bundles for the most probable next pages before the user even moves their mouse.
**Data used:** Route transitions derived from user's local `useLocation` history, modeled as a directed graph with transition counts, stored dynamically in client `localStorage` (`oracle_nav_graph`).
**Impact:** Pages load near-instantly on click, since the network penalty (fetching the chunked bundle) was paid predictively while the user was simply reading the current page. The app feels impossibly fast and ahead of the user.
**Next opportunity:** Expand prediction to preemptively fetching *data* (like generating the first AI prompt background summary based on the exact path taken to reach the chat page).
