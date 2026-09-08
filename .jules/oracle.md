## 2024-05-18 — Predictive Navigation Mesh
**Product understood as:** JusticeAI - A local AI-powered legal co-pilot for Indian Citizens to help navigate laws and cases.
**Prediction invented:** Predictive Navigation Mesh - Tracks the graph of routes a user navigates between, predicts the most probable next route based on historical transitions, and automatically prefetches its chunk in the background.
**Data used:** User navigation sequences (`oracle_nav_graph` in `localStorage`), tracking `from -> to` route transitions.
**Impact:** When users perform repeated flows (e.g., Landing -> Chat -> Case Tracker), the next page's code is already loaded before they click, reducing perceived load time to near zero.
**Next opportunity:** Pre-compute likely document generation templates based on the current AI Chat context, so they are ready as soon as the user enters the Document Vault.
