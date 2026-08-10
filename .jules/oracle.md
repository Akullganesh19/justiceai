## 2024-08-10 — Predictive Route Prefetching Engine
**Product understood as:** An AI-powered legal co-pilot for Indian citizens, providing tools to understand rights, track cases, check legal aid, and find lawyers.
**Prediction invented:** Predictive Route Prefetching Engine. We detect user intent before action by listening for mouseover and touchstart events on links (`<a>`). When a user moves toward or taps a link, we immediately begin downloading the JavaScript chunk for that route in the background.
**Data used:** The signal used is the user's cursor movement or touch interaction indicating intent to navigate to a specific URL path.
**Impact:** By the time the user clicks (~200-400ms after hovering), the page logic is already prefetched into memory, reducing the perceived load time significantly and making the app feel impossibly ahead.
**Next opportunity:** Investigate behavioral prefetching or predicting default values in forms based on frequently used parameters.
