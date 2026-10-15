## 2026-10-15 — Request Coalescing Added
**Gap found:** Naive network requests across the application. If multiple components request the same API resource simultaneously (e.g., config, health, or reference data), redundant network requests are sent.
**Why it existed:** The React frontend was built rapidly without centralized state management for data fetching (like React Query), causing each component to independently fetch what it needs.
**Built:** Invisible request coalescing middleware that intercepts `window.fetch`. It dynamically merges duplicate in-flight GET requests, returning cloned responses to each caller without modifying component logic.
**Hot path affected:** Any dashboard or UI page loading multiple concurrent components reliant on identical GET endpoints.
**Measurable improvement:** Reduces redundant network overhead, server load, and latency on parallel mounts. Logs "[Phantom] Coalescing request" to console when triggered.
**Next opportunity:** Stale-while-revalidate client-side cache to persist static configurations and reference data across navigation.
