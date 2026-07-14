## 2024-07-14 — React Router Data APIs
**Risk identified:** The legacy `<BrowserRouter>` and `<Routes>` pattern in React Router is considered legacy and prevents the use of powerful modern features like route-level data fetching (loaders), actions, and server-side rendering integration. Staying on this pattern locks the application out of standard performance and architectural improvements in React Router v6+ and v7.
**Migration target:** Modern Data Routers using `createBrowserRouter` (or `createMemoryRouter` for tests) and `<RouterProvider>` to unlock full framework capabilities.
**Migrated this session:** `src/main.jsx` and `src/test/App.test.jsx`. The root routing structure has been converted to use `createBrowserRouter` and a `RootLayout` with `<Outlet />`. Tests were updated to use `createMemoryRouter`.
**Remaining:** Migrate individual route components to use route loaders and actions instead of component-level data fetching where appropriate.
**Next session:** Start migrating component-level `useEffect` data fetches in pages (e.g., `DashboardPage`, `LawyerFinderPage`) to route loaders defined in `src/main.jsx`.
