## 2024-05-18 — Chat Intelligence to Case Tracker
**Systems connected:** AI Chat (Analysis) ↔ Case Tracker
**Intelligence emerged:** The Chat system naturally uncovers case timelines, events, and legal strategies through user conversation and AI analysis. The Case Tracker needs these exact milestones but currently requires manual entry or static templates. By connecting them, legal events and timelines discussed in chat automatically sync to the user's Case Tracker pipeline.
**Data flows:** Chat (AI Analysis Timeline) → Event Bridge → Case Tracker (Auto-updates/creates milestones).
**Coupling approach:** Event Bridge Pattern (`window.dispatchEvent` / `CustomEvent`). Chat emits a `justice-ai-case-update` event when it identifies a timeline in its analysis. Case Tracker listens on `window` and updates state, remaining completely decoupled.
**Next connection:** Errors ↔ Auth (proactively notifying users in chat if they hit a known legal flow bug).
