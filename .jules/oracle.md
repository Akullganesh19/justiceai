## 2024-05-23 — Smart Cross-Template Defaults
**Product understood as:** An AI-powered legal co-pilot for Indian Citizens that helps users draft legal documents, understand their rights, and seek legal recourse.
**Prediction invented:** Smart Cross-Template Defaults. Anticipates and pre-fills user identity fields (name, address, phone) across different legal document templates.
**Data used:** User input during document form filling in `src/pages/DocumentsPage.jsx`, persisted in `localStorage` under `justice_ai_oracle_identity`.
**Impact:** Eliminates redundant data entry. When a user drafts an RTI and later drafts an FIR or Legal Notice, their identity details are already populated, making the app feel like it remembers them.
**Next opportunity:** Next-Action Prediction. For instance, after a user generates an FIR draft, pre-warm or suggest the "Lawyer Finder" or "Case Tracker" features.
