## 2024-XX-XX — Migration to React Router v6 Data API (createBrowserRouter)
**Risk identified:** The application is using React Router v6 but relies on the older `<BrowserRouter>` and `<Routes>` pattern. This approach prevents the use of modern React Router data APIs (`loader`, `action`, `useLoaderData`, etc.) which colocate data fetching and mutations with route definitions. As the app grows, relying on `useEffect` for data fetching inside components leads to waterfalls, poorer UX, and harder-to-maintain code. The ecosystem has strongly settled on the data router paradigm.
**Migration target:** Move to `createBrowserRouter` and `RouterProvider`.
**Migrated this session:** `src/main.jsx` and the top-level routing setup.
**Remaining:** Migrate individual pages to use route `loader`s and `action`s instead of in-component `useEffect` data fetching.
**Next session:** Identify the heaviest data-fetching page (e.g., Dashboard or Chat) and migrate its initial data load to a route loader.
