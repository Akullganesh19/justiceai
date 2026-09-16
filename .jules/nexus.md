## 2024-05-17 — Document Archive
**Product understood as:** A comprehensive legal co-pilot that helps citizens understand rights, calculate deadlines, track cases, and generate statutory notices.
**Derivation reasoning:** The product has a dedicated "Procedural Drafting" terminal where users input data and generate formal documents. Users generate these repeatedly. However, there is no state tracking or memory of generated documents—once the user navigates away, the document is lost forever. Users need a persistent archive of their generated notices. Therefore, an explicit Document Archive feature is logically necessary.
**Feature built:** Added persistent saving of generated documents to `localStorage` under `justice_ai_documents`, complete with a "Saved Documents" list on the Documents page, view, and delete capabilities, and an explicit empty state.
**User impact:** Users can now view, recover, and re-download previously generated legal documents without having to regenerate them from scratch.
**Next logical feature:** Since users can generate and save documents, and track cases, the next logical step is to allow attaching saved documents to specific tracked cases.
