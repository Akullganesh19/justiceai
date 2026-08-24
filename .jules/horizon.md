## 2024-06-25 — React Router Data API Migration
**Risk identified:** React Router component-based `<BrowserRouter>` and `<Routes>` setup is being deprecated and is considered legacy. It lacks support for modern data loading features (Loaders/Actions), leading to disjointed data fetching and rendering patterns (waterfalls) as the app scales.
**Migration target:** React Router v6 Data API (`createBrowserRouter` and `<RouterProvider>`), which is the settled ecosystem future and a prerequisite for React Router v7.
**Migrated this session:** Refactored the core application entrypoint (`src/main.jsx`) from component-based routing to the Data Router setup. Created a `RootLayout` component to wrap all child routes, seamlessly preserving all global providers (ErrorBoundary, Toast, CommandPalette, FloatingVoiceButton).
**Remaining:**
- Refactoring individual page components to utilize `loader` and `action` patterns instead of `useEffect` for data fetching.
- Migrating to the `useNavigation` hook for global pending states.
**Next session:** Identify the first page with significant data-fetching (like `DashboardPage` or `CaseTrackerPage`) and convert its `useEffect` fetching logic to a route `loader`.
