1. **Create `src/lib/api-client.js` with `dedupedFetch`:**
   - I'll create `src/lib/api-client.js` exporting `dedupedFetch` and `setupApiClient` to override `window.fetch` to coalesce identical, simultaneous `GET` requests using an `inFlight` Map.
   - Wait, actually, the user explicitly provided the `dedupedFetch` code in the prompt as an example!

2. **Patch `src/main.jsx` to setup the API client:**
   - I will import `setupApiClient` and call it before rendering the React app to ensure that `window.fetch` is monkey-patched with `dedupedFetch`.

3. **Verify the change using Pre-commit:**
   - Complete pre commit steps to ensure proper testing, verification, review, and reflection are done.

4. **Add Phantom Journal entry:**
   - I will append the Phantom journal entry to `.jules/phantom.md` documenting the request coalescing enhancement.

5. **Submit the PR:**
   - I will create a branch `phantom-request-coalescing` and submit the change.
