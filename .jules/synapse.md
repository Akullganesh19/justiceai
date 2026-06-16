## 2024-06-16 — Error ↔ Analytics Connection
**Systems connected:** Error Boundary (System A) ↔ Window Custom Events / Analytics (System B)
**Intelligence emerged:** UI error exceptions can now trigger analytics tracking or custom events without tightly coupling the ErrorBoundary to any specific tracker. Furthermore, using auth data from LocalStorage, the errors are enriched with user identity, allowing tracking of *who* experienced an error.
**Data flows:** Error object and component stack move from `ErrorBoundary` to an event listener on the `window` object. Then, it's enriched with auth data from `localStorage` (`justice_auth_user`).
**Coupling approach:** Event Bridge Pattern via CustomEvent (`justice.system.error`) and Enrichment Pattern via `localStorage`. Neither system directly imports the other. The bridge acts as a thin, independent layer connecting Auth and Errors.
**Next connection:** System Notifications ↔ Local Storage State tracking.
