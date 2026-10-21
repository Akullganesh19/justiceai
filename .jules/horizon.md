## 2025-02-27 — Migrated to react-router-dom Data API
**Risk identified:** Using legacy `<BrowserRouter>` and nested `<Routes>` component approach in React Router v6. This pattern is missing out on modern Data API features (loaders, actions, fetchers) that the ecosystem is adopting.
**Migration target:** The modern `createBrowserRouter` and `<RouterProvider>` data API introduced in react-router-dom v6.4+.
**Migrated this session:** Migrated `src/main.jsx` to use `createBrowserRouter` and `RouterProvider`. Created `src/components/layout/RootLayout.jsx` to host global providers and suspense layout.
**Remaining:** Testing legacy unit tests to work with `createMemoryRouter` instead of `<BrowserRouter>`.
**Next session:** Migrate remaining route configurations to utilize Data Loaders instead of `useEffect`.
