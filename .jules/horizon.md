## 2026-08-22 — React Router Data API Migration
**Risk identified:** Using the legacy `<BrowserRouter>` component-based routing pattern in React Router v6 prevents the use of modern data fetching (loaders), form submissions (actions), and concurrent features. This ages badly as the ecosystem universally moves towards the Data API, leading to potential compatibility issues with future features, plugins, and best practices.
**Migration target:** The React Router modern Data API (`createBrowserRouter` and `RouterProvider`), which is the settled future for the framework.
**Migrated this session:** Restructured `src/main.jsx` to define the route tree with `createBrowserRouter` and centralized root-level UI/context providers into a dedicated `src/components/layout/RootLayout.jsx` component.
**Remaining:** Migrate individual route data fetching patterns (if any exist) to use `loader` functions and integrate them into the `createBrowserRouter` route definitions.
**Next session:** Identify components that use `useEffect` for initial data fetching on route load and migrate them to React Router `loader` functions.
