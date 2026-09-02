## 2024-05-18 — Unused Demo and Alternative Files
**Complexity found:** Extraneous demo pages and a redundant AI chat page (`AIChatPage.jsx`, `AuthDemo.tsx`, `DemoOne.tsx`, `SidebarDemo.tsx`, `sidebar-with-submenu.tsx`, `slideshow.tsx`).
**Why it existed:** Probably created during early development or as examples for UI components but left unused in the final application routing structure.
**Eliminated:** Removed the dead code files that were never actually wired up or utilized in the main app routing (e.g., in `main.jsx`).
**Net change:** -1158 lines, 6 abstractions/components removed.
**Next target:** Assess if `morphing-card-stack.tsx` or `auth-fuse.tsx` can be further simplified or if there's redundant state management logic in chat pages.
