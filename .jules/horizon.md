## 2025-XX-XX — React Router V6 Legacy Routing Migration
**Risk identified:** The project currently utilizes React Router's legacy `BrowserRouter` and nested `<Routes>` architecture in `main.jsx`. This lacks support for React Router v6.4+ modern features (data loaders, actions, error boundaries per route, and the Data API) which is where the ecosystem is moving.
**Migration target:** Modern React Router Data API (`createBrowserRouter`, `RouterProvider`) with a central `BaseLayout` component utilizing `<Outlet />` for global non-UI elements (like Voice Button and Scroll to top).
**Migrated this session:** Migrated `src/main.jsx` to use `createBrowserRouter` and implemented a `BaseLayout` for global functional elements (`CommandPalette`, `FloatingVoiceButton`, `ScrollToTop`, and the global grain overlay). All existing pages and their specific layout requirements (Header/Footer/Props) were safely preserved in this first slice.
**Remaining:**
1. Audit pages to find common layouts and create nested layout structures (e.g. `MainLayout` with Header/Footer vs `FullscreenLayout`).
2. Migrate Header/Footer out of page components into these layouts.
3. Implement route-level Data Loaders instead of `useEffect` fetch calls.
4. Add specific `errorElement` boundaries per route to replace the top-level generic `ErrorBoundary`.
**Next session:** Create nested UI Layouts (MainLayout, FullscreenLayout) and migrate the first batch of pages to use them, taking care to handle prop-drilling requirements (like `onNewCase` in `ChatPage`) via loosely coupled context or events before removing their local Headers.
