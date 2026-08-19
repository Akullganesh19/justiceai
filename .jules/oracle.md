## 2024-05-28 — Predictive Intent & Session Warm-up Engine
**Product understood as:** An AI-powered legal copilot for Indian citizens assisting them through cases, tracking their progress, and explaining laws.
**Prediction invented:** Anticipatory route loading. Automatically preloads specific pages depending on cursor intent (hover/touch navigation) and previous historical actions.
**Data used:** `localStorage` records of user history (`justice_ai_history` and `justice_ai_case_tracker_v2`), and passive observation of `mouseover` and `touchstart` browser events on anchor tags.
**Impact:** Eliminates initial chunk loading latency. Pages appear to load instantly instead of waiting ~100-400ms after clicking. For returning users, their most likely next destination (e.g. tracker or chat) is ready immediately on app load.
**Next opportunity:** Automatically contextualizing the AI copilot chat initialization based on the document a user was just looking at in the document viewer.
