## 2024-03-24 — Migrate to React Router Data API
**Risk identified:** `<BrowserRouter>` with `<Routes>` is the legacy way of doing React routing. The ecosystem and React Router have moved aggressively toward the Data API (`createBrowserRouter`, `RouterProvider`), which is required for modern features like concurrent routing, deferred data loading, and seamless SSR integrations. A developer joining later would have to rewrite the entire routing logic to use these newer primitives.
**Migration target:** React Router Data API (`createBrowserRouter`, `RouterProvider`).
**Migrated this session:** `src/main.jsx` migrated from `<BrowserRouter>` and `<Routes>` to `createBrowserRouter`. Global UI layout wrapper moved into a `RootLayout` component wrapping an `<Outlet>`. Test setup in `src/test/App.test.jsx` updated to use `<MemoryRouter>`.
**Remaining:** Migrate individual route data fetching to use `loader` and `action` functions if necessary, rather than `useEffect` within the components.
**Next session:** Identify a route that does heavy data fetching on mount (e.g., `DashboardPage` or `LawyerFinderPage`) and migrate its data loading logic to a React Router `loader` function.
