## 2025-05-24 — Connect ErrorBoundary with Auth Context

**Systems connected:** ErrorBoundary ↔ Auth (or User Analytics)
**Intelligence emerged:** The error boundary currently only records the error stack. If we connect it to a central event bridge, it can include user/auth context or store error events in the analytics system for better observability. This unlocks emergent intelligence because UI crashes are no longer isolated—they are now correlated with session IDs and user identity from the Auth system.
**Data flows:** ErrorBoundary catches an error -> emits `system.error` event -> Analytics listener logs the error with the current `user` context from Auth.
**Coupling approach:** Event Bridge Pattern using custom event bus.
**Next connection:** System Settings with Context
