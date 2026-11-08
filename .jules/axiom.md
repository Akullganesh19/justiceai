## 2024-10-27 — Redundant AIChatPage Component

**Complexity found:** Two separate chat page implementations (`ChatPage.jsx` and `AIChatPage.jsx`) doing the same thing.
**Why it existed:** Likely an experimental or legacy component created to test a simpler chat interface or different LLM integration before `ChatPage.jsx` was fully stabilized.
**Eliminated:** `src/pages/AIChatPage.jsx`
**Net change:** -237 lines, 1 abstraction removed.
**Next target:** Explore `src/components/ui` for redundant layout/wrapper components or look for duplicated state logic in other pages.
