## 2024-10-24 — Migrate to React Router Data API (createBrowserRouter)
**Risk identified:** The legacy `<BrowserRouter>` and `<Routes>` pattern from React Router v6 prevents the usage of modern routing features (loaders, actions, error boundaries) and compounds technical debt as React and its ecosystem prioritize data-driven routing frameworks (like RR v6.4+ and v7).
**Migration target:** React Router's Data Router API (`createBrowserRouter` and `RouterProvider`).
**Migrated this session:** `src/main.jsx` was successfully migrated to `createBrowserRouter`, implementing a `RootLayout` structure for global UI components. `src/test/App.test.jsx` was updated to use `MemoryRouter` for compatible testing.
**Remaining:** Sub-pages currently handle their own data fetching using `useEffect`. These can be migrated to use route-level `loader` functions to remove layout-shift and improve performance, starting with heavy pages like the Dashboard or Document Generator.
**Next session:** Pick the `DashboardPage` and extract its data fetching into a route loader function inside `src/main.jsx`.
