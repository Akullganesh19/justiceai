## 2026-08-15 — React Router Data API Migration
**Risk identified:** Usage of legacy `<BrowserRouter>` in React Router v6 prevents adopting concurrent features, loaders, actions, and modern error handling, accumulating tech debt as the ecosystem firmly establishes the Data Router architecture.
**Migration target:** Modern `createBrowserRouter` and `RouterProvider` Data API.
**Migrated this session:** Migrating the core `main.jsx` setup to use the Data Router, extracting common providers and UI elements (CommandPalette, FloatingVoiceButton) into a `RootLayout` component.
**Remaining:** Refactoring individual page components to utilize data `loaders` instead of `useEffect` fetching, and converting existing `<ErrorBoundary>` into route-level `errorElement`s.
**Next session:** Start migrating data fetching logic in pages like `ChatPage` or `DashboardPage` to use route loaders.
