## 2024-10-27 — Intelligent Route Prefetching
**Gap found:** The frontend utilized naive lazy loading for route components. Users were forced to wait out a loading spinner whenever they clicked a link to navigate to a new page because the bundle chunk had to be fetched synchronously over the network at the moment of the click.
**Why it existed:** Native React `lazy` paired with React Router was implemented to reduce initial bundle size, but no prefetching strategy was paired with it.
**Built:** An invisible prefetch observer (`mouseover` and `touchstart`) on the `window`. It extracts the target route from `<a>` elements and executes the dynamic chunk import silently in the background before the user even clicks.
**Hot path affected:** Every user navigation event between lazy-loaded routes across the entire app.
**Measurable improvement:** Chunk fetch latency is effectively hidden, resulting in perceived instant page transitions (0ms UI block).
**Next opportunity:** Global fetch interceptor to automatically retry failed idempotent requests.
