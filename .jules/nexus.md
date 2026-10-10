## 2023-10-24 — Predictive Document Pre-filling
**Product understood as:** An AI legal co-pilot that helps citizens understand their rights, analyze cases, and draft legal documents.
**Derivation reasoning:** This product has consultation history data containing rich case facts. Users draft documents based on these cases. Therefore, users obviously need predictive pre-filling for their documents — because otherwise they must manually re-type their entire narrative. It doesn't exist because the chat and document generation systems were built as isolated tools. I'm building it because it significantly reduces friction and leverages existing intelligent data.
**Feature built:** Added context extraction to `FormWizard` that predicts and pre-fills fields (amounts, narratives, facts) based on the user's most recent consultation history.
**User impact:** As a user, I can discuss my issue in chat, then immediately switch to generate a legal notice and find my case facts and claim amounts already filled in.
**Next logical feature:** Global user profile to auto-fill complainant details (Name, Address) across all interactions.
