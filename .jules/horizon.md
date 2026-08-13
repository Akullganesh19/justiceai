## 2024-05-14 — React Router Data API Migration
**Risk identified:** The legacy React Router component-based API (`<BrowserRouter>`, `<Routes>`, `<Route>`) is no longer the recommended standard. It lacks support for advanced data loading and routing capabilities, causing technical debt to accumulate as the ecosystem moves toward the Data API approach.
**Migration target:** React Router's new Data API structure (`createBrowserRouter`, `RouterProvider`).
**Migrated this session:** Restructured `src/main.jsx` to use `createBrowserRouter` and extracted the global layout components (`ToastProvider`, `ErrorBoundary`, etc.) into a dedicated `src/RootLayout.jsx` wrapper component.
**Remaining:** Migrate individual route data fetching, loaders, and actions to the new router, and remove lazy loading where appropriate if data routers handle splitting better.
**Next session:** Start implementing loaders in the highest-traffic pages (e.g. ChatPage or DashboardPage) to replace on-mount `useEffect` data fetching.
