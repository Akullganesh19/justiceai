## 2024-05-24 — Intelligent Identity Pre-filling
**Product understood as:** An AI legal co-pilot that helps citizens track cases, analyze strategies, and generate procedural legal documents.
**Prediction invented:** An intelligent auto-fill system that learns a user's identity (Name, Address, Phone) from their first interaction with the document generator and invisibly pre-fills these exact fields on all subsequent distinct documents, while safely leaving opponent and authority fields blank.
**Data used:** Form keystrokes (`handleChange` events) on specific user-identity fields (`senderName`, `applicantAddress`, etc.) cached locally under `justice_ai_oracle_identity`.
**Impact:** Users generating sequential documents (like an RTI, followed by a Legal Notice) find their own personal information instantly ready, removing redundant typing and making the app feel incredibly personalized and ahead of them.
**Next opportunity:** Route Prefetching: predict the next logical page based on the current context (e.g., prefetching `/tracker` if the user is asking about deadlines in `/chat`).
