## 2026-07-28 — Migrate React Router to Data API (createBrowserRouter)
**Risk identified:** The project used React Router's legacy component API (`<BrowserRouter>` and `<Routes>`), which lacks support for concurrent data loading, actions, and SSR hydration. It will age poorly as React Router v7 deprecates older patterns. We also identified legacy Node `require()` usage in the ES module backend.
**Migration target:** Migrate to React Router's Data API (`createBrowserRouter` and `RouterProvider`), which is the definitively settled future for React Router (v6.4+) and the foundation for full-stack React adoption. Fix legacy backend imports.
**Migrated this session:**
- Replaced `<BrowserRouter>` and `<Routes>` with `createBrowserRouter` in `src/main.jsx`.
- Created an `AppLayout` component to hold global context providers and floating UI.
- Migrated `server.js` from `require('pdf-parse')` to ES modules via dynamic import.
**Remaining:** Migrate individual routes to use `loader` and `action` patterns to fetch data directly via the router.
**Next session:** Start migrating the dashboard or chat data fetching to React Router loaders.
