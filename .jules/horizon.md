## 2024-08-18 — React Router v6 Data API Migration
**Risk identified:** Legacy `<BrowserRouter>` is being phased out of common use by the React ecosystem, missing out on concurrent features, data loading (`loaders`), form actions (`actions`), and making the upgrade path to Remix/React Router v7 significantly harder as technical debt compounds.
**Migration target:** `createBrowserRouter` (React Router Data API)
**Migrated this session:** Initialized `createBrowserRouter` in `src/main.jsx`, wrapped root global components in a `<Layout />` with an `<Outlet />`, and set up `RouterProvider`.
**Remaining:** Migrate individual pages to use data loaders and route actions where appropriate instead of standard `useEffect` fetching and standard form state.
**Next session:** Start migrating the dashboard or chat page fetching to use Route Loaders instead of client-side `useEffect` data fetching.
