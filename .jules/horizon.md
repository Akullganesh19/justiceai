## 2024-05-18 — Migrate React Router DOM to Data API
**Risk identified:** React Router v6 `<BrowserRouter>` is legacy. The React ecosystem (and React Router v7) is moving strictly to Data APIs (`createBrowserRouter`, `RouterProvider`), meaning the current routing will soon become obsolete and block framework upgrades.
**Migration target:** `createBrowserRouter` and `RouterProvider` (React Router v6.4+ Data API).
**Migrated this session:** `src/main.jsx` routing structure updated to use `createBrowserRouter` with a Root Layout and children paths.
**Remaining:** Remove any lingering `<Routes>` usage in nested components if they exist.
**Next session:** Migrate data fetching to Route `loader`s and mutations to `action`s.
