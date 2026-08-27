## 2024-05-24 — Predictive Navigation Mesh
**Product understood as:** An AI-powered legal co-pilot for Indian citizens providing tools like chat, document analysis, estimators, rights info, and case tracking.
**Prediction invented:** A client-side predictive prefetching engine (Markov chain navigation mesh) that learns a user's unique multi-page workflow across sessions and silently prefetches the JavaScript bundle of their statistically most probable *next* click immediately after they arrive on a page.
**Data used:** Route transition events captured via `useLocation` hook in React Router and persisted locally in `localStorage` (`oracle_nav_graph`).
**Impact:** Impossibly fast perceived load times for lazily loaded routes that the user typically accesses next in their sequence.
**Next opportunity:** Predictive pre-filling of estimator or tracker forms based on recently viewed topics or chat contexts.
