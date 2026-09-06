## 2024-05-24 — Predictive Navigation Mesh
**Product understood as:** JusticeAI, an AI-powered legal co-pilot for Indian Citizens with complex, multi-step user workflows (e.g., from Dashboard to Case Tracker, or from Chat to Documents).
**Prediction invented:** Predictive Navigation Mesh (Route Prefetching). It tracks the user's route transitions over time and proactively prefetches the JS chunks for the top 2 routes they are most likely to visit next based on their current page.
**Data used:** `oracle_nav_graph` in `localStorage` which dynamically builds a Markov-chain-like graph of user navigation sequences.
**Impact:** Eliminates perceived page load times for habitual user flows, making the app feel impossibly fast as the user moves through their typical workflows.
**Next opportunity:** Behavioral Prefetching for Case Law or Documents based on chat context. (e.g. If the user asks about "Section 420", pre-emptively fetch the actual text of IPC Section 420 in the background before they ask for more details).
