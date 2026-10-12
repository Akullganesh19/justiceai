## 2025-02-18 — Unused duplicate page components
**Complexity found:** `src/pages/AIChatPage.jsx` and `src/pages/DocumentGeneratorPage.jsx` which completely duplicate the functionality of `src/pages/ChatPage.jsx` and `src/pages/DocumentsPage.jsx`.
**Why it existed:** Likely refactoring artifacts or earlier prototypes that were superseded but never removed.
**Eliminated:** `src/pages/AIChatPage.jsx` and `src/pages/DocumentGeneratorPage.jsx`.
**Net change:** -637 lines deleted, 2 unused abstractions removed.
**Next target:** N/A
