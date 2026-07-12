## 2024-07-12 — React Router Data API Migration
**Risk identified:** The project was using the classic `<BrowserRouter>` and `<Routes>` pattern which is considered legacy in React Router v6+ and lacks support for route-level data fetching (loaders) and actions, making it harder to migrate to newer data paradigms or v7.
**Migration target:** The modern Data Router API (`createBrowserRouter` / `RouterProvider`).
**Migrated this session:** Fully migrated the root application routing (`src/main.jsx`) and the test environment (`src/test/App.test.jsx`) to use the new API.
**Remaining:** Migrate individual components/pages to leverage `loader` and `action` APIs if necessary.
**Next session:** Identify the next high-risk legacy pattern to migrate, or continue with converting data fetching on specific routes to use route loaders.
