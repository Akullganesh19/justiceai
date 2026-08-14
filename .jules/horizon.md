## 2024-05-15 — [React Router Data API Migration]
**Risk identified:** The project currently uses the legacy `<BrowserRouter>` and `<Routes>` components from `react-router-dom` v6. This pattern is increasingly deprecated by the React Router team in favor of the newer Data API (`createBrowserRouter` and `RouterProvider`), which is required for modern features like data loaders, actions, and fetchers. As React 19 approaches and React Router continues evolving (with v7 merging with Remix), sticking to the legacy API will cause significant technical debt, making it harder to adopt server-side data fetching patterns and blocking upgrades.
**Migration target:** Modern React Router Data API (`createBrowserRouter`, `RouterProvider`).
**Migrated this session:**
- Created `src/components/layout/RootLayout.jsx` to manage global layouts (`ScrollToTop`, `CommandPalette`, `FloatingVoiceButton`, `Suspense`).
- Replaced `<BrowserRouter>` in `src/main.jsx` with `createBrowserRouter` and `RouterProvider`.
- Ported all routes to the new object-based format.
**Remaining:**
- Start leveraging React Router `loaders` and `actions` for data fetching instead of inline `useEffect` calls in components (which can be done incrementally in future sessions).
**Next session:** Identify a component doing heavy data fetching on mount (e.g., `DashboardPage` or `ChatPage`) and move its fetching logic into a Route `loader`.
