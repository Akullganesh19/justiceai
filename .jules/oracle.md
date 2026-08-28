## 2025-02-27 — Predictive Navigation Mesh
**Product understood as:** An AI-powered legal co-pilot web application with multiple specialized tool pages (Dashboard, Chat, Estimator, Document Generator).
**Prediction invented:** A Markov chain-based navigation predictor (`OracleNavMesh`) that silently learns which pages users visit next and pre-fetches the dynamic import chunk for the highest probability next route before the user even clicks.
**Data used:** Route transition history stored in `localStorage` under `oracle_nav_graph`.
**Impact:** Eliminates perceived latency for page navigation since React dynamic chunks are already loaded by the time the user executes the predictable action.
**Next opportunity:** Behavior-based pre-fetching of user data on login (e.g., if a user always opens 'Case Tracker' after 'Dashboard', preemptively fire the case tracker API).
