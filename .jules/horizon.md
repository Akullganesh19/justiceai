## 2026-09-06 — Migrate React Router to Data API

**Risk identified:** The project was using the classic `<BrowserRouter>` component from React Router v6. This pattern does not support modern router features like route loaders, actions, fetchers, and the transition features necessary for React 18+ concurrent rendering. Deferring this prevents adopting data-fetching primitives at the route level, complicating state management down the line.
**Migration target:** The modern React Router Data API using `createBrowserRouter` and `RouterProvider`.
**Migrated this session:**
- Converted the main application entry point (`src/main.jsx`) from `<BrowserRouter>` wrapping `<App />` to defining routes using `createBrowserRouter`.
- Converted `<App>` into a generic `RootLayout` with `<Outlet />` that acts as the shell for the application structure.
- Updated `src/test/App.test.jsx` to test the shell component correctly using `<MemoryRouter>`.
**Remaining:**
- The routes currently utilize standard component imports. The next phase of modernization would involve utilizing Route `loader` and `action` patterns to offload data fetching and mutation handling from individual components to the router layer.
**Next session:** Identify the highest-impact page component (e.g., Dashboard or Case Tracker) and refactor its `useEffect` data fetching into a React Router `loader` function.
