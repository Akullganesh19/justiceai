## 2024-05-18 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal co-pilot that helps citizens understand their rights, track cases, and generate documents.
**Prediction invented:** An intelligent prefetching engine that loads routes before the user clicks on them based on predictive hover and session warmup (detecting existing cases or chat history).
**Data used:** Mouseover events on links and historical data presence in localStorage (`justice_ai_history` and `justice_ai_case_tracker_v2`).
**Impact:** Perceived load time drops from ~400ms to near zero because the chunk is already in memory when the navigation occurs.
**Next opportunity:** Prefetching specific case data or chat history from the backend or IndexedDB based on the user's most frequently accessed cases.
