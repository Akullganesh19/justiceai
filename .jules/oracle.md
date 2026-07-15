## 2024-05-18 — Predictive Route and Behavioral Prefetching

**Product understood as:** An AI legal co-pilot single-page application heavily reliant on React Router lazy-loading, where returning users frequently resume existing chat consultations or check case tracker states.

**Prediction invented:** An invisible `OraclePrefetcher` component that intercepts user behavior in two ways:
1. **Behavioral Warm-up:** Automatically triggers background chunk downloads for the AI Chat or Case Tracker routes upon landing based on `localStorage` state (i.e., if history exists).
2. **Intent/Hover Tracking:** Listens globally for mouseover and touchstart events on navigational elements and custom cards (annotated with `data-prefetch-route`), pre-loading the destination chunk before the user clicks.

**Data used:** `localStorage` existence checks for `justice_ai_history` and `justice_ai_case_tracker_v2`, plus global `mouseover` and `touchstart` browser events tracking user intent trajectories.

**Impact:** Perceived latency on frequent navigations (like opening the Chat or clicking a Quick Action from the Dashboard) drops from ~200-400ms (chunk loading over network) to nearly 0ms, making the app feel impossibly responsive and "one step ahead."

**Next opportunity:** Pre-computing legal aid eligibility probabilities in the background while the user reads the legal rights page, readying the result before they ever visit the calculator.
