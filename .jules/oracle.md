## 2024-06-26 — Predictive Next Action UI

**Product understood as:** An AI legal co-pilot that helps Indian citizens research cases, find lawyers, and draft documents.
**Prediction invented:** An engine that analyzes recent chat text (via local storage `justice_ai_history`) to infer the logical next step (Draft Document, Estimate Costs, Find Lawyer) and displays it on the Dashboard as a high-confidence, 1-click action with intelligent pre-filled data.
**Data used:** User messages extracted from the most recent chat session stored in `localStorage` under `justice_ai_history`.
**Impact:** A user who just consulted the bot about a "defective product" can navigate to the Dashboard and immediately see a 1-click "Draft Legal Notice" suggestion that pre-fills the document form with facts from their chat, saving them 3-4 navigation clicks and data entry time.
**Next opportunity:** Predicting likely case outcomes or relevant case law directly during the chat without requiring the user to explicitly ask for an "Analysis".
