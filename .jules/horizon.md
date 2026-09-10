## 2024-05-18 — React Router Data API Migration
**Risk identified:** The project relies on the legacy `BrowserRouter` and `<Routes>`/`<Route>` component tree from `react-router-dom`. As React Router has moved towards Data APIs (`createBrowserRouter`) since version 6.4, continuing with the legacy pattern restricts the usage of powerful modern features (like `loaders`, `actions`, and declarative error elements) and limits future compatibility with server-side rendering (SSR) frameworks.
**Migration target:** React Router Data API (`createBrowserRouter` and `RouterProvider`), aligning with the settled framework ecosystem.
**Migrated this session:** Extracted the top-level app layout (providers, floating components, and `<Suspense>`) into a new `RootLayout` component, and converted `main.jsx` to define the route tree programmatically using `createBrowserRouter` before rendering it via `RouterProvider`.
**Remaining:**
1. Converting data fetching within individual page components to use React Router `loaders`.
2. Converting form submissions and state mutations within page components to use React Router `actions`.
3. Implementing custom error element components within the route configuration.
**Next session:** Begin refactoring the first major page (e.g. `DashboardPage` or `ChatPage`) to lift its initial data fetching into a React Router `loader` and attach it to the route definition.
