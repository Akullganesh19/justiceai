## 2024-07-06 — Global Error Monitoring Event Bridge
**Systems connected:** ErrorBoundary (React UI) ↔ Toast Notification (UI)
**Intelligence emerged:** When a React component crashes and gets caught by ErrorBoundary, the user gets immediately notified via the Toast system instead of just seeing a crash screen or silent console errors. This allows the system to proactively alert the user about failures.
**Data flows:** ErrorBoundary catches error → dispatches global `system.error` CustomEvent with error details → A global listener (perhaps in a context or main layout) catches it → triggers `useToast().error(...)`.
**Coupling approach:** Loosely coupled via `CustomEvent('system.error')`. The `ErrorBoundary` does not need to import or know about `Toast`.
**Next connection:** Auth ↔ Case Tracker (correlating active user to their specific local cases).
