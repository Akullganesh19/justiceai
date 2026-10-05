## 2024-05-24 — UI Layout Duplication Eliminated
**Complexity found:** `Header` and `Footer` components were manually imported and rendered in 23 separate page components. Some pages only imported `Header`, some imported both. `Header` received custom props like `onNewCase` in `ChatPage` and `DemoOne`, requiring special prop drilling.
**Why it existed:** The React application was built incrementally without a central `Layout` wrapper, so each page manually composed its own full-page structure.
**Eliminated:** Manual `Header` and `Footer` imports and JSX in all 23 page files. The prop-drilling of `onNewCase` to `Header` was also removed since global state / events are better for that, or we can handle it at the Layout level.
**Net change:** -50 lines of imports, -46 lines of component rendering across 23 files, added 1 simple `Layout` component.
**Next target:** State management simplification (e.g. tracking local state vs global context).
