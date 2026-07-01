## 2024-05-18 — Error Boundary User Enrichment
**Systems connected:** Auth ↔ Errors
**Intelligence emerged:** When critical system exceptions occur, engineers now know exactly which authenticated user experienced the crash without requiring manual reproduction or separate logging lookups.
**Data flows:** User identity (ID, email) flows from Auth UI (`localStorage: justice_auth_user`) to the Global Error Boundary.
**Coupling approach:** Loosely coupled via `localStorage` (Enrichment Pattern). `ErrorBoundary` gracefully degrades if auth data is absent or unparseable.
**Next connection:** Analytics ↔ Case Tracker (correlating time spent tracking cases with user retention).
