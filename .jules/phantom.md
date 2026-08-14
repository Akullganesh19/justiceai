## 2024-08-14 — Intelligent Route Prefetcher
**Gap found:** Users experienced latency (loading spinners) when navigating to new pages because dynamic React component chunks were only fetched upon clicking the links.
**Why it existed:** Native `React.lazy()` delays fetching chunks until the route is actually matched and rendered, leading to a synchronous wait time during navigation.
**Built:** An invisible global event listener that maps paths to their lazy `import()` functions. It captures `mouseover` and `touchstart` on `<a>` tags and pre-executes the dynamic import in the background before the user even clicks.
**Hot path affected:** Every single client-side route transition in the application.
**Measurable improvement:** Zero visible loading states for users with standard navigation behaviors (hover-to-click takes ~100-300ms, which is typically enough time to fetch the JS chunk).
**Next opportunity:** Implement a Service Worker for offline capability and edge caching of static assets.
