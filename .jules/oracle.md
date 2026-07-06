## 2024-05-18 — Route Prefetching Engine

**Product understood as:** An AI-powered legal co-pilot for Indian Citizens containing chat, document analysis, dashboards, calculators, and trackers.
**Prediction invented:** An invisible route-prefetching engine (`<Oracle />`) that tracks user navigation history, calculates the Markov transition probabilities of which page a user will visit next based on their current page, and aggressively prefetches that module's code in the background using React Router's `lazy` and dynamic `import()` chunks.
**Data used:** User navigation sequence (stored in `localStorage` under `justice_ai_nav_history`).
**Impact:** Pages load near-instantly when a user navigates to the predicted next route, as the JS bundle for that route has already been fetched over the network while the user was interacting with the current page.
**Next opportunity:** Prefetching specific document chunks or AI context embeddings in the background based on the user's current case details.
