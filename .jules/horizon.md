## 2024-05-24 — React Router DOM Migration
**Risk identified:** React Router v6 is deprecating the `<Router>` and `<Routes>` wrapper approach in favor of the new Data API (`createBrowserRouter`, `RouterProvider`). In modern React and React Router apps, failing to migrate blocks adoption of data loaders, actions, and modern SSR patterns, resulting in mounting technical debt.
**Migration target:** `createBrowserRouter` and `RouterProvider` with a data-driven route array instead of JSX routes.
**Migrated this session:** `src/main.jsx` global application routing and layout shell.
**Remaining:** Component-level uses of `useNavigate` and `useLocation` might need verification if loaders/actions are later implemented, but the core routing engine is migrated.
**Next session:** Investigate applying React Router loaders to page components to fetch data pre-render instead of relying purely on `useEffect`.
