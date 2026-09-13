## 2024-05-24 — Request Coalescing Added
**Gap found:** Identical GET requests were being fired independently by components rendering simultaneously.
**Why it existed:** Components managing their own state and effects independently without a shared network layer.
**Built:** Global `window.fetch` monkey-patch to coalesce identical in-flight GET requests, returning cloned responses to satisfy multiple consumers.
**Hot path affected:** Page loads and component mounts that fetch configuration, shared resources, or health endpoints.
**Measurable improvement:** Reduction in redundant concurrent network requests for the exact same resource.
**Next opportunity:** Stale-while-revalidate client-side cache for reference data.
