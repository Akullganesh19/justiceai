## 2026-07-10 — React Router Data Router Migration
**Risk identified:** Legacy `<BrowserRouter>` and `<Routes>` pattern used from React Router v6. This pattern is deprecated for new development and blocks major features (like actions/loaders) and future major version upgrades (to React Router v7 where data routers are standard).
**Migration target:** `createBrowserRouter` and `RouterProvider` (Data Router pattern).
**Migrated this session:** The core routing configuration in `src/main.jsx` and the test wrapper in `src/test/App.test.jsx`.
**Remaining:** Migrate nested routes and lazy loading to use route-level `lazy` properties and `loader`/`action` functions instead of the older `React.lazy` and `Suspense` wrapper at the top level.
**Next session:** Migrate individual page components to use data router features (like `loader`s) and remove the top-level `Suspense` fallback in favor of route-specific error/loading states.
