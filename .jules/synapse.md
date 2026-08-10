## 2024-08-10 — Error Telemetry User Loop
**Systems connected:** Error Boundary (Crash Monitor) ↔ Toast Notifications
**Intelligence emerged:** When the application encounters a fatal error and falls back to the Error Boundary, it now dispatches an immediate notification to the user via the global Toast system. This connects passive system monitoring directly to the active user session, providing real-time awareness and transforming a silent failure or jarring crash screen into a communicative state.
**Data flows:** ErrorBoundary (componentDidCatch) -> window.dispatchEvent(justice-ai-toast) -> ToastContainer shows message.
**Coupling approach:** The Error Boundary uses a standard CustomEvent `justice-ai-toast` to broadcast the failure globally. The ToastProvider listens for this event independently, ensuring neither system directly imports or depends on the other's implementation details.
**Next connection:** User Behavior ↔ Content Surfacing (e.g., recommend tools based on search history).
