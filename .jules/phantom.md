## 2024-05-18 — Request Coalescing Added
**Gap found:** The frontend had no mechanism to prevent identical, simultaneous GET requests. Multiple components mounting or triggering updates concurrently could hit the same endpoint simultaneously.
**Why it existed:** Default fetch behavior is naive; it fires a request for every call without deduplicating in-flight network activity.
**Built:** A `fetchInterceptor` that wraps `window.fetch`. It generates a cache key based on URL, method, and Authorization headers. If an identical GET request is already in-flight, it returns a clone of the original response rather than hitting the network again.
**Hot path affected:** Any page or component architecture where multiple child components fetch the same reference data (e.g., config, health, or user settings) on mount.
**Measurable improvement:** Reduces redundant network overhead and backend load by dropping duplicated requests during concurrent rendering.
**Next opportunity:** Implement a stale-while-revalidate caching layer for infrequently updated data (like legal terminology or FAQs).
