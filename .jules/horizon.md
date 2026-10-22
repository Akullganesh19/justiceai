## 2025-02-27 — Migrate React Router to Data API
**Risk identified:** Using `<BrowserRouter>` and `<Routes>` pattern in React Router v6+ misses out on advanced Data API features (loaders, actions, fetchers) which are becoming standard in modern React apps and critical for performance and data fetching consistency. This will age badly as new features increasingly require the Data API.
**Migration target:** `createBrowserRouter` and `RouterProvider`.
**Migrated this session:** `src/main.jsx` migrated from `<BrowserRouter>` to `createBrowserRouter` with a `RootLayout` component utilizing `<Outlet />`.
**Remaining:** Migrate data fetching to loaders/actions if/when appropriate in individual route components.
**Next session:** Identify routes that fetch data on load and migrate them to use React Router loaders.
