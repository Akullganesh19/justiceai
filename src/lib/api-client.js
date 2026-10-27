const inFlight = new Map();

/**
 * A wrapper around native fetch that coalesces identical simultaneous GET requests.
 * If multiple components request the same URL simultaneously, only one network request
 * will be made. The response is cloned for each caller to prevent "body already consumed" errors.
 */
export async function dedupedFetch(input, init) {
  // Determine method, handling Request objects
  let method = 'GET';
  let url = input;

  if (typeof input === 'object' && input instanceof Request) {
    method = input.method;
    url = input.url;
  } else if (init && init.method) {
    method = init.method;
  }

  // Only deduplicate GET requests
  if (method.toUpperCase() !== 'GET') {
    return fetch(input, init);
  }

  if (inFlight.has(url)) {
    const promise = inFlight.get(url);
    const response = await promise;
    return response.clone();
  }

  const promise = fetch(input, init)
    .then((response) => {
      // In-flight completes, remove from map so future requests fetch anew
      inFlight.delete(url);
      return response;
    })
    .catch((err) => {
      inFlight.delete(url);
      throw err;
    });

  inFlight.set(url, promise);

  const response = await promise;
  return response.clone();
}
