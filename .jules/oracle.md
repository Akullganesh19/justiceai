## 2026-07-24 — Hover-based Route Chunk Prefetching
**Product understood as:** An AI legal co-pilot single-page application (SPA) with multiple deeply-split modular route chunks (e.g., chat, estimator, lawyer finder).
**Prediction invented:** Hover-based predictive route prefetching. When a user hovers over any navigational link (`<a>` tag), the system predicts an imminent click and fetches the required JavaScript bundle chunk in the background before the actual click event occurs.
**Data used:** Global DOM mouseover events tracking `a[href]` elements and normalizing the path to match centralized route chunks.
**Impact:** Drastically reduced perceived navigation latency; removing the brief loading spinner fallback and making page transitions feel instantaneous.
**Next opportunity:** Behavior-based API data prefetching (e.g. prefetching case data when hovering over a specific case item in the tracker).