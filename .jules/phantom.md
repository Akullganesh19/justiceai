## 2024-05-24 — Request Coalescing and SWR Caching
**Gap found:** Multiple identical API calls (e.g., `/api/voice/config`) were being made concurrently during component mounts or interactions, and static config/data responses weren't aggressively cached on the client.
**Why it existed:** Native `fetch` lacks built-in request deduplication (coalescing) and an easy stale-while-revalidate pattern, leading to redundant network roundtrips.
**Built:** A global `fetch` interceptor (`phantomFetch.js`) that deduplicates identical concurrent GET requests and implements a 5-minute Stale-While-Revalidate cache using `Response.clone()`.
**Hot path affected:** Any repeated GET request, significantly `/api/voice/config` on `FloatingVoiceButton` initialization.
**Measurable improvement:** Reduces duplicate network requests on page load and component mounts. Subsequent navigation and config checks instantly resolve from cache while revalidating seamlessly in the background.
**Next opportunity:** Intelligent background pre-fetching of routes or data based on user hover intent.
