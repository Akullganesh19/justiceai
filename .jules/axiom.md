## 2024-05-19 — Centralized Application Layout & Shell

**Complexity found:** The `<Header />` and `<Footer />` components were manually imported and explicitly rendered in exactly 22 distinct `.jsx` page files. The application's `main.jsx` manually managed `BrowserRouter` without utilizing layout routes to consolidate shell structure.
**Why it existed:** The application was likely built incrementally page-by-page, where engineers copy-pasted the shell structure instead of centralizing it at the routing level.
**Eliminated:**
  - 44 manual `import Header/Footer` statements removed across all pages.
  - 44 manual JSX element invocations (`<Header />`, `<Footer />`) removed.
  - A scattered event listener implementation (`onNewCase` passed globally) was unified into a custom Window event dispatcher.
**Net change:**
  - Created `RootLayout.jsx` with `MainLayout` and `HeaderLayout` (approx 20 lines added).
  - Modified `main.jsx` to use React Router Data API (`createBrowserRouter` with layout wrappers).
  - Deleted approx 90+ lines of redundant markup/imports across 22 files.
**Next target:** Identify complex, static config arrays (like `CASE_TEMPLATES` in CaseTrackerPage) taking up 300+ lines in component files and extract them, or collapse the duplicate 4 form wizards across multiple pages.
