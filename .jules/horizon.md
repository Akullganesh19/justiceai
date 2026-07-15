## 2024-05-30 — Migrate to React Router Data Routers
**Risk identified:** Classic `<BrowserRouter>` pattern used in `react-router-dom` v6+ is legacy and will make upgrading to v7 painful. It also prevents us from utilizing route-level data fetching (loaders) and actions.
**Migration target:** Modern Data Routers (`createBrowserRouter`, `RouterProvider`) to enable route-level data fetching and ensure React Router v7 compatibility.
**Migrated this session:** Main entrypoint (`src/main.jsx`) and test setup (`src/test/App.test.jsx`) to use `createBrowserRouter` and `createMemoryRouter`.
**Remaining:** Adopt route-level `loader` functions to prefetch data for high-traffic routes instead of standard `useEffect` fetching. Check nested routing configurations if added.
**Next session:** Adopt route-level `loader` functions to prefetch data for high-traffic routes (like `/dashboard` or `/chat`).