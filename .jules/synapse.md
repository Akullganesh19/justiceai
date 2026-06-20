## 2024-05-20 — Error Telemetry Enrichment
**Systems connected:** Auth ↔ Errors/Telemetry
**Intelligence emerged:** We can now correlate system errors with the specific users who encountered them, allowing for proactive outreach and better debugging of user-specific issues.
**Data flows:** Auth context (email, name) flows from the `justice_auth_user` localStorage state into the ErrorBoundary via the `justice-telemetry-error` EventBridge, enriching the telemetry data before it is saved to `justice_ai_analytics`.
**Coupling approach:** The EventBridge pattern combined with the Enrichment pattern ensures the systems remain completely decoupled. The ErrorBoundary broadcasts an event when it catches an error. A lightweight bridge (`TelemetryBridge.js`) listens for this event, independently fetches the user context from localStorage, and saves the enriched telemetry. Neither system imports or depends on the other directly.
**Next connection:** User Behavior ↔ Content/Data (e.g., using `justice_ai_analytics` to surface relevant legal resources based on features frequently used by the user).
