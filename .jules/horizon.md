## 2025-02-18 — React Router Data API Migration
**Risk identified:** The project currently uses the legacy `<BrowserRouter>` and `<Routes>` component-based routing setup from React Router v6. This pattern is increasingly deprecated by the React ecosystem and React Router themselves in favor of the Data Router API (`createBrowserRouter`), which is required for modern features like concurrent data fetching, deferred rendering, and route-level error boundaries. Continuing to use the component-based approach will limit the application's ability to adopt new React 18+ paradigms and cause a much harder migration path when React Router v7 becomes standard.
**Migration target:** React Router Data API (`createBrowserRouter`, `RouterProvider`) combined with layout routes for global providers and suspense boundaries.
**Migrated this session:** The core application routing in `src/main.jsx` was successfully migrated to use `createBrowserRouter` and `RouterProvider`. The `<BrowserRouter>` was replaced, and the top-level providers were refactored into a `Layout` component using `<Outlet />`. Tests were also updated to use `<MemoryRouter>`.
**Remaining:**
- Convert individual page components to use Data API loaders (`loader`) and actions (`action`) instead of component-level `useEffect` for data fetching.
- Implement explicit error boundaries at the route level using `errorElement` in the router config.
- Refactor the global fallback and error handlers to fully leverage the Data API structure.
**Next session:** Begin migrating the most critical data-fetching page (e.g., `DashboardPage` or `ChatPage`) to use a route `loader` and eliminate its `useEffect` on-mount fetching.
