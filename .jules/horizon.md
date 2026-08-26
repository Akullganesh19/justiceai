## 2024-05-27 — React Router Data API Migration
**Risk identified:** The project currently uses `<BrowserRouter>` from React Router v6, which works but misses out on the modern Data API features (loaders, actions, error elements, concurrent data fetching). As the app grows and adds more data-heavy routes, sticking with the legacy component-based routing will lead to worse performance (waterfall requests) and harder state management, becoming increasingly painful over the next 1-2 years as the ecosystem fully transitions to Data Routers.
**Migration target:** Modern React Router Data API (`createBrowserRouter`, `RouterProvider`).
**Migrated this session:** Replaced `<BrowserRouter>` with `createBrowserRouter` in `src/main.jsx`. Introduced a `<RootLayout>` component in `src/components/layout/RootLayout.jsx` to handle global layout and Suspense. Updated tests in `src/test/App.test.jsx` to use `<MemoryRouter>` for compatibility with the new routing pattern.
**Remaining:**
1. Convert individual route components to use `loader` and `action` functions where data fetching is needed.
2. Implement route-level `errorElement`s instead of relying solely on the global `ErrorBoundary`.
**Next session:** Start by migrating the `DashboardPage` to use a route `loader` for fetching its initial data, replacing `useEffect`-based data fetching.
