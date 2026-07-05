## 2025-07-05 — Bookmarked Conversations

**Product understood as:** JusticeAI is a legal-tech AI assistant and information platform that helps citizens navigate Indian law, draft documents, and evaluate case viability.
**Derivation reasoning:**
- We store: Case consultations in localStorage ('justice_ai_history') which is shown as 'INTELLIGENCE_RECORDS' in the dashboard and tracked as past chats.
- Users do: Interact with the AI copilot for extended legal advice, creating history entries. They return to the dashboard to see recent records.
- Therefore users obviously need: A way to bookmark, save, or "star" specific conversations so they don't get lost as they do more chats (since only the top 5 are shown or easily accessible).
- It doesn't exist because: The history feature is currently a simple chronological array dumped to localStorage without metadata for importance or bookmarking.
- I'm building it because: Legal issues span months. Users need a reliable way to pin a specific consultation about their ongoing case so they can return to it without searching through unrelated queries.

**Feature built:** Pinned/Bookmarked cases. Added a bookmark toggle on recent case cards in the dashboard and the chat sidebar, persisting a `pinned` boolean in localStorage. Added a "Pinned" filter or section in the Dashboard.
**User impact:** Users can now save critical legal consultations permanently, ensuring they don't roll off the "recent" list.
**Next logical feature:** Case outcome tracking or linking a chat thread directly to the CaseTracker timeline.
