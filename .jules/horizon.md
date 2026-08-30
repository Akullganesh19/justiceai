## 2024-05-18 — React Router Data API Migration
**Risk identified:** Legacy `<BrowserRouter>` and `<Routes>` pattern used in `src/main.jsx`. The React Router ecosystem has moved to the Data API (`createBrowserRouter`, `RouterProvider`) which is required for modern features like loaders, actions, and future framework compatibility. The legacy pattern will become increasingly difficult to maintain and integrate with modern data fetching strategies.
**Migration target:** React Router v6.4+ Data API.
**Migrated this session:**
- Converted `src/main.jsx` routing structure to use `createBrowserRouter` and `RouterProvider`.
- Abstracted global components and `Suspense` into a `RootLayout` component utilizing `<Outlet />`.
- Updated test environment (`src/test/App.test.jsx`) to use `<MemoryRouter>` matching the pattern for testing the Data API.
**Remaining:**
- Migrate individual page data fetching from `useEffect` inside components to route-level `loader` functions.
- Migrate form submissions to route-level `action` functions.
**Next session:** Pick up data fetching migration by identifying a page with straightforward `useEffect` data loading (e.g. fetching glossary terms or FAQs) and moving it to a route loader in `src/main.jsx`.
