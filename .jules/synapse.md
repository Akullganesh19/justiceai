## 2024-05-20 — Auth & Errors to Analytics Event Bridge
**Systems connected:** AuthUI, ErrorBoundary ↔ AnalyticsSystem
**Intelligence emerged:** Cross-system observability. Analytics now knows when users login, signup, or encounter unhandled exceptions, enabling correlation between user activity, error frequency, and specific user accounts without tight coupling.
**Data flows:** AuthUI emits user details on login/signup, ErrorBoundary emits crash details on error -> EventBridge -> AnalyticsSystem tracks them.
**Coupling approach:** Event Bridge Pattern. AuthUI and ErrorBoundary emit generic events to a global `EventBridge`. The `AnalyticsSystem` listens to these events independently. Neither system imports the other.
**Next connection:** User Behavior ↔ Content/Data. Track user interaction with legal terminology/documents to provide personalized search results and highlight recently accessed sections.
