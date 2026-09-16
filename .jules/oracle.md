## 2024-05-25 — Cross-Template Smart Defaults
**Product understood as:** JusticeAI is a procedural drafting tool for legal documents where users fill out forms to generate statutory requests, notices, and incident reports.
**Prediction invented:** Cross-Template Smart Defaults prefill the form with a user's identity details (name, address, phone number) by extracting and persisting these values in localStorage across different templates.
**Data used:** The user's input across different form fields in `DocumentsPage.jsx`. When a user completes a form, their identity fields are extracted (excluding recipient/opposite-party fields) and stored. When they start a new form, those fields are pre-filled.
**Impact:** Eliminates repetitive entry of the user's name, address, and phone number, which is particularly useful since many forms require these details. The user experiences a smarter, more personalized system that remembers who they are.
**Next opportunity:** Predictive caching or prefetching of templates the user is likely to need next, or predicting the next logical step (e.g., predicting that after an RTI is filed, an appeal template might be needed).
