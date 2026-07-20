## 2024-05-24 — Route Chunk Prefetching
**Product understood as:** An AI legal co-pilot (single page React application) using React Router where users navigate across multiple distinct tools and pages (chat, estimators, dashboard).
**Prediction invented:** Anticipating user navigation by intelligently prefetching lazy-loaded route chunks the moment the user hovers over an `<a>` link on the same origin.
**Data used:** Global `mouseover` event targeting `<a>` links. The destination `pathname` acts as the signal for which route to preload.
**Impact:** Perceived load time drops dramatically. Before: user clicks -> JS chunk requested over network -> 200-500ms block -> page renders. After: user moves cursor toward link -> chunk already loading -> user clicks -> instantaneous transition.
**Next opportunity:** Predicting the *next likely message* a user will send in the AI chat based on context, and pre-warming the inference server to generate the first few tokens.