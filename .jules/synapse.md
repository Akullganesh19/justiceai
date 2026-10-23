## 2024-03-24 — Analysis to Tracker Integration
**Systems connected:** AI Chat Analysis (Timeline) ↔ Case Tracker
**Intelligence emerged:** The AI chat generates a precise statutory timeline based on user input, but currently this timeline is isolated. The user has to manually create a new case and select a generic template in the Case Tracker. Connecting these means the AI-generated timeline can automatically initialize a customized case plan in the tracker.
**Data flows:** Timeline steps and title flow from `justice_ai_history` (specifically the current case analysis timeline) to the Case Tracker's `justice_ai_case_tracker_v2` storage via React Router state.
**Coupling approach:** A UI button in the `Timeline` component that dispatches the current case data to the `/tracker` route, where `CaseTrackerPage` intercepts it and initializes a new case.
**Next connection:** TBD
