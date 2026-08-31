## 2024-05-17 — React Router Data API Migration
**Risk identified:** The project is using React Router v6 but relies on the legacy `<BrowserRouter>` and `<Routes>` components. The React ecosystem and React Router official documentation heavily push the new Data API (`createBrowserRouter`, `RouterProvider`) which unlocks advanced features like data loading, actions, and error elements that the legacy router cannot support. This represents a compounding risk as newer libraries assume Data API availability.
**Migration target:** The modern React Router Data API (`createBrowserRouter` and `RouterProvider`).
**Migrated this session:** Replaced the legacy router setup in `src/main.jsx` with `createBrowserRouter` utilizing a `RootLayout` component, and updated test wrappers in `src/test/App.test.jsx` to use `<MemoryRouter>` for compatibility.
**Remaining:** Convert individual route components to utilize `loader` and `action` functions where appropriate to move data fetching logic out of components and into the router layer.
**Next session:** Identify a data-heavy route (like Dashboard or Case Tracker) and migrate its initial data fetching to a router `loader`.
