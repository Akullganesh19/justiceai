## 2024-05-24 — Route Chunk Prefetching
**Product understood as:** An AI legal co-pilot for Indian citizens, featuring chat interfaces, case estimators, and document generators built as a React SPA with lazy-loaded route chunks.
**Prediction invented:** Added predictive prefetching for lazy-loaded route chunks. The system detects user intent (hover or touch on navigational anchor tags) and aggressively pre-loads the code payload for the target route before the user even completes the click.
**Data used:** User interaction signals (`mouseover` and `touchstart` events on `<a>` tags matching mapped internal route paths).
**Impact:** Perceived page load latency for subsequent routes drops from ~400ms (network fetching after click) to near ~50ms (instantly rendering already loaded code).
**Next opportunity:** Anticipate likely follow-up queries based on conversational AI responses (e.g. pre-computing the response to "How do I file this?").
