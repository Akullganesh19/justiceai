## 2024-05-15 — React Router Data API Migration
**Risk identified:** React Router `BrowserRouter` with nested `<Routes>` is technically valid in v6, but the React ecosystem and React Router itself are aggressively moving toward the Data API (`createBrowserRouter` / `RouterProvider`). Without it, future features like loaders, actions, and modern data-fetching paradigms cannot be used. Continuing with the old `<BrowserRouter>` pattern leads to compounding tech debt as the broader React community standardizes on the data-fetching routing architecture.
**Migration target:** React Router Data API (`createBrowserRouter`).
**Migrated this session:** Migrated `src/main.jsx` global routing from `<BrowserRouter>` structure to `createBrowserRouter`, extracting global UI wrappers into a `<RootLayout>` element, and converting `src/test/App.test.jsx` tests to use `MemoryRouter`.
**Remaining:** Migrate individual pages to use route loaders and actions instead of `useEffect` for data fetching.
**Next session:** Identify the highest-traffic page using `useEffect` for initial data fetching and convert it to a route `loader` within the router configuration.
