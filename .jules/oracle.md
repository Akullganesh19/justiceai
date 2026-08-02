## 2026-08-02 — Predictive Route Prefetching Engine

**Product understood as:** An AI legal co-pilot single-page app (SPA) for Indian citizens, featuring a dashboard, chat interfaces, and various legal document tools using React and lazy-loaded routes.
**Prediction invented:** Implemented a predictive route prefetching engine that starts fetching the JavaScript bundle for a destination page the moment a user hovers over an internal link, before they even click.
**Data used:** The signal used is user intent demonstrated via mouse movement (`mouseover` events on `a[href]` elements), pointing towards a specific, parsable internal URL pathname.
**Impact:** Perceived latency drops significantly. By the time a user completes a click (often taking 200-300ms from the start of a hover), the lazily-loaded route chunk has already been fetched over the network or is heavily cached, making the transition feel instantaneous rather than showing a loading spinner.
**Next opportunity:** Behavior-based prefetching for API responses. If a user frequently asks similar questions or we know what legal process follows the current one, we can preemptively ask the AI or query the backend so the answer is ready the moment they navigate.
