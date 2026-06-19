## 2024-03-01 — Predictive Intelligence: Intelligent Defaults Engine

**Product understood as:** An AI-powered legal co-pilot for Indian citizens, featuring a chat interface, cost estimator, lawyer finder, and document generator. Users often engage the AI first to explain their case, then transition to functional tools.
**Prediction invented:** An intelligent default system (`predictUserIntent`) that anticipates the user's current legal need by reading their most recent interaction stored in `justice_ai_history` (`localStorage`), analyzing keywords, and mapping them to domain intents (e.g., consumer, criminal, family).
**Data used:** `justice_ai_history` (the user's chat history stored in local storage), specifically analyzing the title, AI-generated `caseType`, and the first 3 user messages.
**Impact:**
1. `EstimatorPage`: Automatically pre-selects the relevant `caseType`.
2. `LawyerFinderPage`: Automatically pre-selects the `selectedSpec` (Lawyer specialization).
3. `DocumentGeneratorPage`: Automatically pre-selects the `templateId`.
Users see a "🛸 Predicted from your recent case" badge when a default is applied, making the UI feel anticipatory and deeply connected to their initial query.
**Next opportunity:** Behavior Prefetch: when the user's intent is strongly predicted, prefetch the underlying static documents or API data for the predicted domains in the background to reduce load times when they eventually click the tools.
