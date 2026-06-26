## 2025-02-24 — Case Timeline Auto-Sync
**Systems connected:** AI Chat Analysis ↔ Case Tracker
**Intelligence emerged:** When the AI analyzes a case and builds a timeline in Chat, it automatically flows into the Case Tracker, creating a ready-to-use project plan without manual data entry.
**Data flows:** AI Chat dispatches `justice-ai-analysis-complete` CustomEvent containing case ID, title, type, and timeline array. `IntelligenceBridge` component listens and updates localStorage `justice_ai_case_tracker_v2`.
**Coupling approach:** Event Bridge Pattern. The Chat system doesn't know about Case Tracker or localStorage. It just broadcasts when an analysis is done. A new, headless `IntelligenceBridge` component mounted in `main.jsx` listens for this event and translates it into Case Tracker's expected format.
**Next connection:** Auth ↔ Error logs. So we can alert users if a specific error is affecting their account.
