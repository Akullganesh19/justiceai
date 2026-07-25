## 2024-05-24 — Intelligent Route Prefetching
**Product understood as:** An AI legal co-pilot (single-page application) for Indian citizens, featuring AI chat, case estimators, and document generators. It consists of multiple heavily lazy-loaded pages via React Router.
**Prediction invented:** Predictive route prefetching on hover. By creating a centralized `routeChunks` map and attaching a global `mouseover` event listener to `window`, the app detects when a user moves their mouse toward a navigation link and proactively initiates the download of that page's chunk in the background before the user even clicks.
**Data used:** User's mouse position and intent (hovering over an `<a>` tag) and the link's `href` attribute.
**Impact:** Eliminates the typical ~400ms chunk loading delay upon clicking a lazy-loaded route. When the user eventually clicks, the chunk is already in memory or caching, resulting in a near-instant perceived load time.
**Next opportunity:** Session warm-up. On login or app open, prefetch the top 3 routes (like `/chat`, `/dashboard`) that users always visit first.
