1. **Create `src/lib/api-client.js`:**
   - Implement `dedupedFetch` that wraps the native `fetch` API.
   - It should maintain a `Map` of in-flight requests (for `GET` requests).
   - If a request is already in-flight, it should return a clone of the response from the promise.
2. **Update `src/components/voice/FloatingVoiceButton.jsx` to use `dedupedFetch`:**
   - Import `dedupedFetch`.
   - Replace `fetch('/api/voice/config')` with `dedupedFetch('/api/voice/config')`.
3. **Verify the changes:**
   - Check if `dedupedFetch` works as intended.
4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
5. **Submit the PR**
   - Title: "🌀 Phantom: [infrastructure description]"
