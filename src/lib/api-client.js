export const dedupedFetch = (() => {
  const inFlight = new Map();
  return async (input, init) => {
    // Extract method correctly from either init or Request object
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

    // Only deduplicate GET requests
    if (method !== 'GET') {
      return fetch(input, init);
    }

    // Extract URL properly to avoid "[object Request]" collisions
    const url = input instanceof Request ? input.url : input.toString();

    // Check if we are already fetching this URL
    if (inFlight.has(url)) {
      const response = await inFlight.get(url);
      return response.clone(); // Clone so body can be read multiple times
    }

    const promise = fetch(input, init)
      .then(res => {
        inFlight.delete(url);
        return res;
      })
      .catch(err => {
        inFlight.delete(url);
        throw err;
      });

    inFlight.set(url, promise);

    const response = await promise;
    return response.clone();
  };
})();
