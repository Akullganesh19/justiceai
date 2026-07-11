## 2026-07-11 — Migrate React Router to v7-compatible Data Routers

**Risk identified:** The project currently uses `<BrowserRouter>` and `<Routes>`, a pattern that is considered legacy in React Router v6+ and may not be fully supported in v7 and beyond. This prevents the usage of powerful modern features like route-level data fetching (loaders), form actions, and error boundaries integrated into the routing layer, causing compounding technical debt as these patterns become the ecosystem standard.

**Migration target:** Modern React Router Data Routers (`createBrowserRouter`, `RouterProvider` in app code; `createMemoryRouter` in tests).

**Migrated this session:**
- The main entry point `src/main.jsx` was migrated to use `createBrowserRouter` and `RouterProvider`. A `RootLayout` component was introduced as a wrapper.
- The top-level test utilities in `src/test/App.test.jsx` were migrated to use `createMemoryRouter`.

**Remaining:**
- Individual route components should gradually adopt the `loader` and `action` pattern for data fetching and mutations, moving away from component-level `useEffect` based data loading.
- Sub-routers or nested routing definitions (if any exist deeper in the app) should be converted to route objects within the main `createBrowserRouter` configuration.

**Next session:**
- Begin migrating `useEffect` based API calls in a high-traffic page (e.g., Dashboard or Chat) to React Router `loader` functions for optimized data fetching.
