## 2024-06-17 — Proactive Next-Action Prediction and State Pre-filling

**Product understood as:** An AI-powered legal co-pilot for Indian citizens providing chat consultations, RAG over legal documents, cost estimation, document generation, and case tracking.

**Prediction invented:** A session warm-up Oracle engine (`predictNextAction` in `src/lib/oracle.js`) that predicts the user's next logical step based on their most recent case analysis data (stored in `localStorage` as 'justice_ai_history'). The engine identifies if the strategy requires document generation (e.g., Legal Notice), filing a petition (which warrants case tracking), or involves complex/monetary disputes (which requires cost estimation). This prediction is cached on the dashboard and prompts users with a one-click "Anticipation" action. Furthermore, clicking these proactive actions auto-pre-fills intelligent defaults (e.g., document template choice, case tracking type and title, estimator case type) utilizing a consume/dispose context pattern.

**Data used:** The signal relies on `justice_ai_history` `localStorage` entries—specifically inspecting the `analysis` blocks (including `strategy`, `caseType`, `timeline`, `laws`) and the case `title`.

**Impact:** The user experience drastically shifts from reactive navigation to predictive assistance. Users no longer need to find the "Generate Document" or "Estimate Costs" tools manually post-consultation—the system detects their needs, recommends the next step on the dashboard, and skips selection screens by pre-filling the relevant context.

**Next opportunity:** Expand the Oracle engine to do background RAG prefetching for heavily accessed documents or predictive query caching based on the case type identified.
