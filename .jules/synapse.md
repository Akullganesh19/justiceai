## 2024-05-20 — Error Enrichment Bridge
**Systems connected:** Auth ↔ Errors (via EventBridge + AnalyticsSystem)
**Intelligence emerged:** When a system error occurs, we now automatically know *which user* experienced it, allowing for proactive outreach or correlated debugging without either system knowing about the other directly.
**Data flows:** Auth (`user.login`/`user.signup`) -> EventBridge -> AnalyticsSystem -> EventBridge <- Errors (`system.error`)
**Coupling approach:** Loosely coupled Pub/Sub (`EventBridge.js`). Auth emits login events. ErrorBoundary emits error events. `AnalyticsSystem` listens to both and joins the context together.
**Next connection:** Connect Analytics with Feature Usage (perhaps case tracking limits).
