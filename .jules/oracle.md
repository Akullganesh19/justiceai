## 2024-05-24 — Predictive Background Route Prefetching
**Product understood as:** An AI-powered legal co-pilot for Indian citizens, providing tools like chat, document analysis, estimators, and trackers.
**Prediction invented:** Predictive Background Route Prefetching based on user navigation state (e.g., if on Landing, prefetch Dashboard and Chat; if on Dashboard, prefetch Tracker and Estimator).
**Data used:** User's current location/route derived from `useLocation()`.
**Impact:** Impossibly fast perceived navigation transitions because predictable next pages are loaded in the background before the user decides to click.
**Next opportunity:** Pre-computing answers to frequently asked legal questions for a given session based on user's initial interaction.
