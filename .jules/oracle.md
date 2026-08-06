## 2024-08-06 — Predictive Route Prefetching
**Product understood as:** An AI-powered legal co-pilot for Indian citizens, providing tools like legal aid checkers, case trackers, estimator, and AI chat.
**Prediction invented:** Predictive route prefetching. The app anticipates where the user is going based on hover or touch intent on links, and dynamically preloads the associated React component chunk before the user even clicks.
**Data used:** User hover (`mouseover`) and touch (`touchstart`) events on anchor (`<a>`) elements.
**Impact:** Impossibly fast perceived navigation. By the time the user completes the click, the JavaScript bundle for the next page is already downloaded or in-flight, dropping perceived load times from ~400ms to near zero.
**Next opportunity:** Session warm-up based on user roles (e.g., prefetching lawyer onboarding chunks for specific users) or pre-computing limitation periods in the background as the user types their case details.
