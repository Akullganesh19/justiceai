## 2024-10-24 — React Router Data API Migration
**Risk identified:** The legacy `<BrowserRouter>` component pattern is effectively deprecated for complex apps; the ecosystem and React Router v6+ are heavily moving toward the Data API (`createBrowserRouter`) which unlocks loaders, actions, and advanced concurrent rendering features.
**Migration target:** React Router Data API (`createBrowserRouter` and `RouterProvider`).
**Migrated this session:** Migrated the root application shell (`src/main.jsx`) to use `createBrowserRouter` and `RouterProvider` with a new `RootLayout` component.
**Remaining:** Migrating specific page-level data fetching (like `useEffect` blocks) to React Router `loader` functions.
**Next session:** Identify a page with simple data fetching (e.g., loading predefined case templates) and refactor it to use a route `loader`.
