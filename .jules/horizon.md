## 2024-05-24 — React Router Data API Migration
**Risk identified:** The legacy component-based React Router setup (`<BrowserRouter>`, `<Routes>`, `<Route>`) lacks support for the modern `loader` and `action` data fetching primitives, blocking predictive intelligence and causing future tech debt to compound as the ecosystem moves away from synchronous render-and-fetch routing models.
**Migration target:** React Router Data API (`createBrowserRouter`, `RouterProvider`).
**Migrated this session:** `src/main.jsx` was successfully migrated to create a `RootLayout` structure passed to `createBrowserRouter`, converting the existing routes to the new array structure.
**Remaining:** Migrate individual pages to use `loader` and `action` data-fetching primitives instead of `useEffect`, moving data fetching outside the component render cycle.
**Next session:** Start migrating the core features in `src/pages/DashboardPage.jsx` and `src/pages/ChatPage.jsx` to take advantage of `loader` primitives for data injection and prefetching.
