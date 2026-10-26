## 2024-05-18 — Auth ↔ Error Tracking (User Context Enrichment)
**Systems connected:** Auth System ↔ Error Boundary System
**Intelligence emerged:** When a critical application error occurs, the Error Boundary now knows exactly *which user* experienced it, what their role/tier is, and their session state. This allows engineers to prioritize bug fixes based on user segment impact, and enables proactive apologies/support to affected users without them needing to report the bug manually.
**Data flows:** Auth state (user profile/session) flows from the Auth component/local storage into the global ErrorBoundary context, enriching the error log payload.
**Coupling approach:** The ErrorBoundary uses a loosely coupled custom event or reads from a shared context (`localStorage.getItem('justice_ai_user')` or similar, depending on how auth is implemented here) when an error is caught. It does not import the Auth module directly, but enriches its error payload with whatever user context is available at the time of the crash.
**Next connection:** Analytics ↔ Router (Feature usage tracking by user segment)
