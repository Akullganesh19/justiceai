## 2024-10-25 — React Router Data API Migration
**Risk identified:** The legacy `<BrowserRouter>` and `<Routes>` pattern from React Router v6 is technically functional but is explicitly superseded by the new Data API (`createBrowserRouter`). Deferring this makes it harder to use advanced features like route loaders, actions, and nested layouts, leading to disjointed data fetching and higher tech debt over time.
**Migration target:** React Router v6.4+ Data API (`createBrowserRouter`, `RouterProvider`). This is where the ecosystem is settled.
**Migrated this session:** Replaced the legacy router block in `src/main.jsx` with a modern `createBrowserRouter` object wrapping all existing routes inside a new `<RootLayout>`.
**Remaining:** Migrate individual pages to use loaders and actions instead of `useEffect` for data fetching. Introduce error elements at the route level instead of using a global ErrorBoundary.
**Next session:** Start migrating the most frequently visited data-heavy page (likely Dashboard or Chat) to use a route `loader` to fetch its initial state.
