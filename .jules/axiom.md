## 2024-06-19 — Dead Prototype Pages and Orphaned UI Components
**Complexity found:** An entirely duplicated chat interface implementation (`AIChatPage.jsx`) alongside multiple test pages (`DemoOne.tsx`, `SidebarDemo.tsx`, `AuthDemo.tsx`). These pages had no routes mapped to them and were completely disconnected from the dependency tree.
**Why it existed:** Likely remnants of previous UI prototyping, temporary rewrites, or isolated test components that were abandoned but never cleaned up from the repository.
**Eliminated:**
- `src/pages/AIChatPage.jsx`
- `src/pages/DemoOne.tsx`
- `src/pages/SidebarDemo.tsx`
- `src/pages/AuthDemo.tsx`
**Net change:** -526 lines of code. 4 entire files (and associated cognitive overhead) removed.
**Next target:** Finding logic duplicated between `LandingPage.jsx` and `ShowcasePage.jsx`, or auditing unused abstractions in the `server.js` middleware layer.
