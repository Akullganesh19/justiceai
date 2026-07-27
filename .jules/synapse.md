## 2026-07-27 — Error Monitoring to Toast Notification
**Systems connected:** Global Error/Promise Monitor ↔ User Notification (Toast)
**Intelligence emerged:** Proactive error surfacing to users for background exceptions (like failed fetch promises or script errors) that would otherwise fail silently.
**Data flows:** Error exceptions and unhandled promise rejections are captured, mapped to a user-friendly format, and sent from the error monitor to the notification UI via a global window CustomEvent.
**Coupling approach:** Event Bridge Pattern. The Error listener (errorBridge) dispatches a 'justice-ai-toast' event on the window, and ToastProvider listens for it. Neither system imports the other.
**Next connection:** Connect Auth (User Plan/Status) ↔ Case Tracker (to limit case tracking capacity based on auth plan).
