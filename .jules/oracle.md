## 2024-05-30 — Pre-computation & Intelligent Defaults

**Product understood as:** A comprehensive legal co-pilot web application (React/Vite) that helps users analyze cases, draft legal documents, estimate costs, and track limitations.
**Prediction invented:**
1. **Background Pre-computation:** Automatically calls the LLM in the background to draft a Legal Notice right after a successful case analysis completes.
2. **Predictive UI:** Surfaces an "Oracle Prediction" banner in the Document Generator page that instantly provides the pre-computed draft to the user without making them re-enter information.
3. **Intelligent Defaults:** Automatically infers the `caseType` and `complexity` in the Cost Estimator page based on the user's recent case history text, pre-filling the dropdowns.
**Data used:** The existing `localStorage` arrays (`justice_ai_history` for cases and `justice_ai_oracle_doc` for the new pre-computed draft).
**Impact:** Users will experience instantaneous document generation (zero wait time) if they transition from Chat -> Document Generation. They will also find the Estimator page already configured for their specific context.
**Next opportunity:** Expand prediction to intelligently pre-fetch context-specific FAQ answers and suggest limitation deadlines immediately based on Chat case details.
