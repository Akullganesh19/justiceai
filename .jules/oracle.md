## 2024-05-24 — Predictive Document Generation
**Product understood as:** An AI-powered legal co-pilot that helps citizens understand their rights, get consultation, and draft procedural documents.
**Prediction invented:** Anticipates which legal document a user needs to draft NEXT based on the conversation history of their most recent AI consultation. Pre-sorts the templates by probability and intelligently defaults the form fields with extracted context from the chat.
**Data used:** `justice_ai_history` stored in `localStorage` containing the user's prior chat session messages and system analysis.
**Impact:** When users finish a consultation and navigate to Documents to take action, their likely required document is surfaced first (with a "PREDICTED" badge), and fields like claim amount, incident details, and narrative are already pre-filled. This saves significant typing and makes the app feel magically ahead of the user.
**Next opportunity:** Predictive resolution pathways on the Dashboard — analyzing the status of tracked cases in CaseTracker and surfacing the next logical action (e.g., "Hearing in 2 days, prepare summary").
