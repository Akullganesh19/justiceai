## 2024-05-15 — EventBridge Auth ↔ Analytics Integration
**Systems connected:** AuthUI / ErrorBoundary ↔ AnalyticsSystem
**Intelligence emerged:** Analytics now correctly tracks when users log in and associates errors with the affected user without hardcoding dependencies between these systems.
**Data flows:** AuthUI fires `user.login` and ErrorBoundary fires `system.error` with their local context -> EventBridge relays to -> AnalyticsSystem, which enriches error data with the currently tracked user.
**Coupling approach:** Loosely coupled using an EventBridge pattern (`globalEventBus`). Neither AuthUI nor ErrorBoundary imports AnalyticsSystem directly.
**Next connection:** Connect CaseTracker with NotificationSystem to proactively alert users when their case procedural status advances.
