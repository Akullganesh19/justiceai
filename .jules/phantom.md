## 2024-06-25 — Predictive Route Prefetching
**Gap found:** Naive lazy loading on click, where users wait for route chunks to download after clicking a link.
**Why it existed:** Default React.lazy behavior without an explicit prefetching strategy.
**Built:** Global event listeners (mouseover, touchstart) that eagerly load lazy route chunks in the background before the user clicks.
**Hot path affected:** Route navigation across the entire app.
**Measurable improvement:** Near zero latency on route transitions.
**Next opportunity:** Deduplicating identical API requests on page load.
