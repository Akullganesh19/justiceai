## 2024-03-20 — React Router v7 Migration
**Risk identified:** React Router v6 is aging and its current minor version (v6.22) lacks the robust data fetching, streaming, and modern view transitions integrated into v7. Delaying the migration will lead to increased fragmentation between standard components and newer data-loading paradigms, making future upgrades substantially harder as new route configurations are adopted.
**Migration target:** React Router v7, combining the modern routing API with robust features previously found in Remix, adopting react-router-dom@7.x.
**Migrated this session:** Upgraded react-router-dom dependency to v7.18.4 safely via --legacy-peer-deps. Verified that the existing declarative API (<BrowserRouter>, <Routes>, <Route>) works seamlessly as v7 maintains backwards compatibility for these patterns.
**Remaining:** Gradually transition from declarative <Routes> to the data-driven createBrowserRouter to unlock v7 loaders, actions, and advanced fetchers. Refactor top-level <BrowserRouter> in main.jsx to RouterProvider.
**Next session:** Start migrating src/main.jsx routing to createBrowserRouter array-based configurations.
