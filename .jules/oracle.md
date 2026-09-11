## 2024-06-25 — Cross-Template Smart Defaults
**Product understood as:** A local AI-powered legal co-pilot for Indian Citizens that generates legal documents, notices, and applications.
**Prediction invented:** Cross-Template Smart Defaults (Intelligent Defaults). When a user generates a document and provides their name/address (e.g., in a Legal Notice), the system predicts they will use the same identity for future documents (e.g., an RTI Application or Consumer Complaint) and automatically pre-fills these fields across all templates.
**Data used:** User input from document generation fields (sender_name, applicant_name, complainant_name, etc.), persisted to localStorage under `justice_ai_oracle_identity`.
**Impact:** Users don't have to re-type their personal details (name, address) every time they switch to a new document template. The form is already pre-filled with their identity, reducing friction and making the app feel ahead of them.
**Next opportunity:** Next-Action Prediction: Predict the next template a user might need based on the sequence of previously generated documents (e.g., suggesting a Legal Notice if they just tracked a certain case).
