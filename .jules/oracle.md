## 2024-03-24 — Predictive Route Prefetching
**Product understood as:** An AI-Powered Legal Co-pilot for Indian Citizens containing multiple separate tools (Chat, Estimator, Lawyer Finder, etc).
**Prediction invented:** Anticipating user navigation before they click. When users move their mouse towards a link or begin touching a link on mobile, the application predicts this action and triggers a background fetch of the corresponding lazy-loaded chunk.
**Data used:** User intent signals, specifically `mouseover` and `touchstart` browser events on same-origin anchor (`<a>`) tags, mapping their `href` to our centralized route chunks.
**Impact:** Eliminates the ~300ms perceived delay when a chunk is normally loaded on-demand, making page transitions feel instant and the app appear impossibly fast.
**Next opportunity:** Prefetching specific document templates or legal calculators based on context inferred from a user's ongoing ChatPage conversation.
