## 2024-05-24 — Authentication and Error Event Bridge to Analytics
**Systems connected:** AuthUI, ErrorBoundary ↔ EventBridge ↔ AnalyticsSystem
**Intelligence emerged:** Analytics and monitoring systems can now react to user lifecycle events (login, register) and UI errors without directly coupling to the AuthUI or React tree. This enables correlating user activity with application stability and usage patterns.
**Data flows:** `user.login` (with email) and `user.register` (with name, email) flow from `AuthUI` to `globalEventBus`, and are listened to by `src/main.jsx` which forwards them to `analyticsSystem.identify`. `system.error` (with error string and component stack) flows from `ErrorBoundary` to `globalEventBus`, which forwards it to `analyticsSystem.logError`.
**Coupling approach:** The systems use `globalEventBus` as an event bridge (Pub/Sub pattern). Neither `AuthUI` nor `ErrorBoundary` knows about the AnalyticsSystem. The connection layer in `main.jsx` is thin.
**Next connection:** Correlate user activity events with AI backend RAG actions to see which searches return the most errors.
