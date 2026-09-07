## 2024-05-18 — React Router Data API Migration
**Risk identified:** The project uses the legacy React Router `<Routes>` and `<Route>` components. This approach is being phased out in the React ecosystem in favor of Data Routers (`createBrowserRouter`), which enable advanced features like route loaders, actions, fetchers, and future concurrency capabilities. Staying on the legacy router prevents taking advantage of these optimizations and increases technical debt as the community moves fully to the Data API.
**Migration target:** React Router Data API (`createBrowserRouter` and `RouterProvider`).
**Migrated this session:** Migrated `src/main.jsx` to use `createBrowserRouter` with a new `RootLayout` structure and the `{ index: true }` convention. Also updated test suites to use `<MemoryRouter>` for compatibility.
**Remaining:** Migrate individual pages to use route loaders and actions for data fetching, removing `useEffect` where appropriate.
**Next session:** Identify a heavily data-dependent page (like the CaseTracker or Dashboard) and migrate its `useEffect` data fetching logic to a React Router `loader`.
