## 2025-07-09 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal co-pilot that helps Indian citizens navigate complex legal issues, track cases, and prepare for legal proceedings.
**Prediction invented:** An OraclePrefetcher component that uses a user's current route to predict and prefetch the JavaScript chunks for the routes they are most likely to visit next (e.g., prefetching /chat and /tracker while the user reads /dashboard).
**Data used:** The signal used is the current application route (`window.location.pathname`).
**Impact:** Eliminates perceived load times when navigating between the most common user flows, making the transition to heavy pages like /chat feel instantaneous.
**Next opportunity:** Analyze common sequences within the /chat page itself to predictively pre-load relevant context or prompt suggestions before the user types.
