## 2025-05-30 — Eliminated Unused/Redundant Page Components
**Complexity found:** Two large unrouted page components `src/pages/AIChatPage.jsx` and `src/pages/DocumentGeneratorPage.jsx`.
**Why it existed:** Historical reasons — likely old iterations or prototypes of the chat and document generation features that were superseded by `ChatPage.jsx` and `DocumentsPage.jsx`.
**Eliminated:** `AIChatPage.jsx` and `DocumentGeneratorPage.jsx` completely.
**Net change:** -636 lines, 2 redundant abstractions removed.
**Next target:** Explore `src/components/ui/` for duplicate or unused UI components.
