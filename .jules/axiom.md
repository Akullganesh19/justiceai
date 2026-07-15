## 2025-02-18 — Unused Demo and Redundant Pages
**Complexity found:** Multiple unused "Demo" pages (`DemoOne.tsx`, `SidebarDemo.tsx`, `AuthDemo.tsx`), completely disconnected UI components (`slideshow.tsx`, `sidebar-with-submenu.tsx`), and functionally duplicate pages (`AIChatPage.jsx` when `ChatPage.jsx` is used, `DocumentGeneratorPage.jsx` when `DocumentsPage.jsx` covers the same feature set).
**Why it existed:** Likely remnants of prototyping, proof-of-concept components, and unmigrated v1 pages kept "just in case" while new implementations were built.
**Eliminated:** 7 files totaling over 1,500 lines of unused or duplicated code.
**Net change:** -1500 lines, -7 files.
**Next target:** Evaluate `src/pages/ShowcasePage.jsx` and `IntelligenceSelectionTerminal.jsx` for actual usage or consolidation.
