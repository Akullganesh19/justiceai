## 2024-07-11 — Consultation History Search
**Product understood as:** A local-first legal consultation and case tracking system that accumulates conversational history and legal milestones over time.
**Derivation reasoning:** The app stores historical chat consultations (`justice_ai_history`) and lists them in a sidebar (`CaseHistorySidebar.jsx`). As a user continues using the product for different legal issues over months, this list will grow indefinitely. The user will inevitably need to find a specific past consultation (e.g., "that tenant dispute from last year"). Currently, they have to manually scroll and read every title. Therefore, they obviously need a way to search/filter their history.
**Feature built:** A real-time search/filter input at the top of the CaseHistorySidebar that filters the history array by consultation title before rendering.
**User impact:** Users can instantly retrieve specific past legal consultations by typing keywords, eliminating manual scrolling and cognitive load.
**Next logical feature:** Categorization/Tagging of past cases (e.g., "Civil", "Criminal").
