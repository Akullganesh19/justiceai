## $(date +%Y-%m-%d) — [Predictive Navigation Mesh]
**Product understood as:** An AI-powered legal co-pilot and document generator that users interact with across multiple distinct workflows (chat, document generation, finding lawyers, estimating costs).
**Prediction invented:** Predictive Navigation Mesh (PredictiveOracle). It tracks actual user navigation transitions in `localStorage` to build a Markov chain (transition probability graph). It then uses this graph to preemptively trigger dynamic imports (`React.lazy` chunks) for the most likely next route based on their current page. It also prefetches routes on `mouseover` intent.
**Data used:** User navigation paths (`location.pathname`), stored as a transition graph in `localStorage` ('oracle_nav_graph').
**Impact:** Zero perceived load time for lazy-loaded routes as they are prefetched in the background before the user clicks, resulting in instantaneous page transitions.
**Next opportunity:** Predicting form defaults or pre-generating initial AI chat prompts based on the path the user took to arrive at a specific legal domain.
