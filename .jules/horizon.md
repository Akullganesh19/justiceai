## 2025-05-13 — React Router Data API Migration
**Risk identified:** The application relies on the legacy `<BrowserRouter>` and `<Routes>` pattern which blocks the adoption of modern React Router features (like loaders, actions, fetchers) and is being phased out in future major versions.
**Migration target:** The React Router Data API (`createBrowserRouter` and `RouterProvider`), which is the settled future of the ecosystem for React routing.
**Migrated this session:** Refactored the core routing in `src/main.jsx` to use `createBrowserRouter` and `RouterProvider`. Created a `RootLayout` component for global wrappers. Updated `src/test/App.test.jsx` to use `MemoryRouter` instead of `BrowserRouter` to align with modern testing patterns for the Data API.
**Remaining:** Migrate individual routes to utilize Data API features such as route `loader`s (for pre-fetching) and `action`s (for form submissions) instead of relying entirely on standard React state and effect hooks.
**Next session:** Identify a data-heavy route (e.g., Dashboard or Documents) and refactor its data fetching logic to use a route `loader`.
