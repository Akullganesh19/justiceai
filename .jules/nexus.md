## 2024-05-19 — Document Generation History / Storage

**Product understood as:** A comprehensive AI-powered legal co-pilot that helps citizens understand their rights, chat with AI, track cases, and generate legal documents.

**Derivation reasoning:**
- We store user chat history in `justice_ai_history`
- We store user case tracker data in `justice_ai_case_tracker_v2`
- Users can generate documents (notices, RTI, etc.) on the `/documents` page (`DocumentsPage.jsx`)
- BUT... the generated documents are completely ephemeral! They are stored in state (`generatedDoc`) but lost if the user navigates away or refreshes the page. There is no `justice_ai_documents` localStorage or document history view!
- This violates the "Actions Without Memory" pattern. Users take the time to fill out multi-step forms and generate crucial legal documents, but the app never learns or remembers them.
- Therefore, users obviously need a **Saved Documents History** on the Documents page (and dashboard) so they can revisit, re-download, or reference past drafts without having to re-type everything.

**Feature built:** Saved Documents capability. Documents are persisted to `justice_ai_documents` in `localStorage` upon generation. The `DocumentsPage` will display a "Recent Documents" section below or above the templates, allowing users to view previously generated documents.

**User impact:** Users can now generate legal documents and safely find them later without having to recreate them from scratch.

**Next logical feature:** Ability to attach generated documents directly to an active chat case in `ChatPage`.
