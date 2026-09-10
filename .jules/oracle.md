## 2024-05-24 — Document Prediction Engine
**Product understood as:** JusticeAI is a local AI-powered legal co-pilot for Indian Citizens guiding them via chat and allowing them to draft necessary statutory documents.
**Prediction invented:** 1. Next-Action Prediction (badges and reorders document templates based on the AI analysis of their most recent chat case). 2. Smart Defaults Identity Memory (auto-learns and pre-fills user's identity details across different document templates).
**Data used:** `justice_ai_history` for analyzing case context to suggest the next document. `justice_ai_oracle_identity` (new local cache) to persist user identity points (Name, Address, Phone).
**Impact:** Users generating multiple notices or applications no longer need to type their identity information repeatedly. Users exploring documents after a chat are immediately pointed toward the most relevant document.
**Next opportunity:** Prefetching specific document fields or templates immediately upon navigation to the documents page to decrease perceived load time.
