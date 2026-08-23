## 2026-08-23 — [React Router Data API Migration]
**Risk identified:** The legacy React Router `<Router>` and `<Routes>` architecture pattern is being superseded by the Data API (`createBrowserRouter`, `RouterProvider`), and will age badly over the next 2-3 years as we try to implement predictive prefetching and data loading.
**Migration target:** React Router v6.4+ Data API.
**Migrated this session:** Extracted the core layout shell into a dedicated `RootLayout.jsx` component and rewrote the primary app entry point (`src/main.jsx`) to initialize routes using `createBrowserRouter`.
**Remaining:** Migrate individual data-fetching logic inside components to use the new `loader` and `action` primitives natively supported by the Data API structure. Integrate granular `errorElement` configurations per route to replace the monolithic fallback structure.
**Next session:** Identify the highest-risk route that performs heavy data fetching on mount (like `/tracker` or `/dashboard`) and refactor its internal fetch logic to leverage a Data API `loader`.
