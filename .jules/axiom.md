## 2024-05-19 — AIChatPage.jsx and DocumentGeneratorPage.jsx
**Complexity found:** Two entirely separate React components/pages that were completely disconnected from the routing layer (`src/main.jsx`). `AIChatPage.jsx` appeared to be a duplicate/alternate version of `ChatPage.jsx`, and `DocumentGeneratorPage.jsx` appeared to be an alternate version of `DocumentsPage.jsx`.
**Why it existed:** Likely abandoned experiments, previous versions, or redundant components that were never cleaned up.
**Eliminated:** `src/pages/AIChatPage.jsx` and `src/pages/DocumentGeneratorPage.jsx` have been deleted.
**Net change:** -636 lines, 2 files eliminated.
**Next target:** Explore `src/pages/DocumentsPage.jsx` for complex form management that can be simplified.
