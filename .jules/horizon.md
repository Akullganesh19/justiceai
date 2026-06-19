## 2026-06-19 — React Router v7 Upgrade

**Risk identified:** The project is on `react-router-dom` v6. The ecosystem has settled on React Router v7 as the standard. Staying on v6 accumulates technical debt, prevents usage of modern React 19 features optimized in v7, and makes future migrations significantly harder.
**Migration target:** Upgrade to `react-router-dom` v7 to ensure compatibility with modern React patterns and future-proof the application's routing infrastructure.
**Migrated this session:** Upgraded the `react-router-dom` and `react-router` dependencies to v7.18.0 in `package.json`. The current usage of `<BrowserRouter>`, `<Routes>`, and `<Route>` is fully compatible with v7, so no application code changes were required for this initial slice.
**Remaining:** The current implementation uses the classic `<BrowserRouter>`. To fully leverage v7's future-proof features (like data fetching and preloading), we should migrate to the data router `createBrowserRouter`.
**Next session:** Refactor the application entry point and routing configuration to use `createBrowserRouter` and `RouterProvider`.
