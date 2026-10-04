## 2024-05-18 — Generated Documents History

**Product understood as:** A comprehensive legal co-pilot that helps citizens understand their rights, estimate costs, get advice, and generate legal documents like FIR drafts or RTI applications.

**Derivation reasoning:**
- The product has a "Draft Documents" capability (`/documents`) where users fill out forms to generate structured legal texts (RTI, FIR, Consumer Complaint, Legal Notice).
- Users spend time filling out forms, generating a legal document, and optionally downloading it.
- However, once they navigate away from the page, the generated document and its form data are completely lost.
- There is no history or saved state for generated documents, meaning users have to re-enter all information if they want to refer back to it or make a small change.
- Existing data: The system already has a robust `localStorage`-based history for chats (`justice_ai_history`) and case tracking.
- Missing feature: Document History / Saved Documents.

**Feature built:** Added `justice_ai_documents` localStorage mechanism to automatically save generated documents. Updated `DocumentsPage.jsx` to list these past documents, allow users to view them, or re-initialize the form with past data.

**User impact:** Users can now safely navigate away from the Document Generator knowing their drafted legal notices or applications are saved in their browser and can be retrieved or edited later.

**Next logical feature:** Since users can save generated documents, the next step would be connecting a generated document directly to the "Case Tracker" module so a drafted FIR automatically creates a new tracked case.
