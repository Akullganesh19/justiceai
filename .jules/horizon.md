## 2024-08-16 — React Router Data API Migration
**Risk identified:** The current codebase uses the older `<BrowserRouter>` component with `<Routes>` and `<Route>`. This older API will not support newer React Router features like loaders, actions, and advanced data fetching strategies, and is slowly being deprecated in favor of the Data Router API. Continuing to use the older API will make future upgrades and refactors increasingly difficult and block the adoption of modern React ecosystem features.
**Migration target:** The modern React Router Data API (`createBrowserRouter` and `<RouterProvider>`).
**Migrated this session:** `src/main.jsx` was migrated to use `createBrowserRouter` and `<RouterProvider>`. The global UI wrappers (`grain-overlay`, `ScrollToTop`, `CommandPalette`, `FloatingVoiceButton`, and `<Suspense>`) were extracted into a `RootLayout` component, and all existing lazy-loaded routes were mapped as children to the root route (`/`).
**Remaining:**
1. Convert components fetching data on mount (e.g., `useEffect` data fetching) to use the new `loader` API in the route definitions.
2. Convert components performing mutations to use the new `action` API.
3. Replace manual error boundaries inside route components with `errorElement` properties on the routes themselves.
**Next session:** Start migrating data fetching logic to React Router `loader`s in the most heavily used pages (e.g., Dashboard or Document pages) to benefit from early parallel data fetching before render.