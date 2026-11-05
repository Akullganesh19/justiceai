## YYYY-MM-DD — Migrate to React Router Data API
**Risk identified:** The project currently uses `<BrowserRouter>` from `react-router-dom` in `src/main.jsx`. The React ecosystem and React Router have moved toward the modern Data API (`createBrowserRouter`, `RouterProvider`), which is required for advanced features like data loaders, actions, and concurrent features. Continuing with the legacy API prevents leveraging these features and prepares the app for React 19+ paradigms.
**Migration target:** Modern React Router Data API (`createBrowserRouter`, `RouterProvider`, `Outlet`).
**Migrated this session:** `src/main.jsx` routing configuration and creation of a `BaseLayout` for global UI elements.
**Remaining:** Migrate any other legacy routing patterns (like `useNavigate` for simple redirects, or `<Routes>` in nested components) if they exist.
**Next session:** Identify and migrate any remaining legacy routing patterns or explore other lagging dependencies.
