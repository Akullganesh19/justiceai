## 2025-02-18 — Migrate to React Router Data API
**Risk identified:** The project uses the legacy `<BrowserRouter>` with nested `<Routes>` which is deprecated in modern React Router v6+ architectures. Sticking to the legacy router prevents the adoption of advanced features like loaders, actions, and predictive prefetching, making future feature development more difficult and creating technical debt that compounds over time.
**Migration target:** The modern React Router DOM Data API (`createBrowserRouter`, `RouterProvider`), which is the settled ecosystem standard for React routing.
**Migrated this session:** The main application entry point (`src/main.jsx`) has been completely migrated to use `createBrowserRouter` and `RouterProvider`. Layout elements and context providers have been extracted into a unified `Layout` component wrapping an `<Outlet />`.
**Remaining:** Migrate individual pages to use data loaders and actions where appropriate to fully leverage the new Data API capabilities.
**Next session:** Investigate individual route components to implement data loading mechanisms natively provided by the Data API instead of doing client-side fetching in `useEffect`.
