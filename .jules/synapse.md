## 2025-02-26 — Auth ↔ Errors
**Systems connected:** Auth (`auth-fuse.tsx`) ↔ Errors (`ErrorBoundary.jsx`)
**Intelligence emerged:** Error reports now include the specific user context, allowing engineers to know exactly which users are hitting which errors most, without modifying the core logic of either system.
**Data flows:** Auth broadcasts user identity events (`justice.auth.login`). ErrorBoundary listens, maintains current user context, and enriches its error reports with this identity.
**Coupling approach:** Event Bridge pattern via DOM CustomEvents. ErrorBoundary reads from local storage for initial state and listens to events for updates, completely unaware of how the Auth UI is implemented.
**Next connection:** Errors ↔ Analytics (capturing frequent error events to trigger user notifications or product health metrics).
