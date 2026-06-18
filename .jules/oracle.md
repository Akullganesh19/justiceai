## 2024-05-18 — Predictive Navigation Engine
**Product understood as:** AI-powered legal co-pilot for Indian citizens providing analysis, document templates, and case tracking.
**Prediction invented:** Behavioral Navigation Prefetching (`src/lib/prediction/oracle.js`).
**Data used:** User's local navigation history stored in `localStorage` under `oracle_nav_history` (Markov chain tracking what pages they navigate to).
**Impact:** Tracks page-to-page transitions. If a user has a >60% probability of navigating to a specific route next based on their own history, the UI subtly highlights that link and we could expand it to prefetch React components/data via events.
**Next opportunity:** Extend the Oracle to prefetch actual local legal data or generate predictive chat responses in the background based on typical sequences.
