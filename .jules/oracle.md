## 2024-05-24 — Predictive Route Prefetching
**Product understood as:** An AI legal co-pilot single-page application heavily relying on React Router and lazy-loaded route chunks to minimize initial load times.
**Prediction invented:** Predictive route chunk prefetching. The system anticipates where the user is going to navigate next by detecting hover (`mouseover`) and touch (`touchstart`) events on anchor tags globally.
**Data used:** User's cursor and touch intent as signal. It parses the target URL, extracts the `pathname`, matches it against a centralized registry of lazily-loaded route chunks (`routeChunks`), and invokes the module import in the background before the click event even occurs.
**Impact:** Perceived load times for route transitions approach near zero. The network request for the React chunk is initiated while the user is still physically moving their cursor or finger to the click target, closing the latency gap.
**Next opportunity:** Behavior-based prefetching for common workflows (e.g. if user is on `/chat`, proactively pre-warm the backend summarization API or document generation).
