## 2024-07-23 — Predictive Intent-based Prefetching
**Product understood as:** An AI legal co-pilot SPA for Indian citizens built with React and heavily utilizing lazy-loaded route chunks to segment bundles.
**Prediction invented:** Predictive prefetching of route chunks triggered by the user's cursor hovering over or moving towards `<a>` links.
**Data used:** DOM `mouseover` events combined with matching the `href` to an internal lazy-loaded route chunk map.
**Impact:** Users will experience near-instant perceived load times when clicking navigation links, as the chunk bundle fetch is initiated ~100-300ms prior to the actual click event during the hover intent phase.
**Next opportunity:** Predictive session warm-up fetching data based on user roles (e.g. preemptively fetching active cases if the user is a logged-in lawyer).
