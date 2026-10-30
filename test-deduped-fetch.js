import { dedupedFetch } from './src/lib/api-client.js';

// Setup global fetch mock
let fetchCallCount = 0;
global.fetch = async (url, options) => {
  fetchCallCount++;
  return {
    clone: () => ({ url }),
    url
  };
};

global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
  }
};

async function runTest() {
  console.log('Testing dedupedFetch...');

  // Test 1: Simultaneous identical GET requests
  const p1 = dedupedFetch('https://api.example.com/data');
  const p2 = dedupedFetch('https://api.example.com/data');

  await Promise.all([p1, p2]);

  if (fetchCallCount === 1) {
    console.log('✅ Simultaneous GET requests deduplicated successfully.');
  } else {
    console.error('❌ Expected 1 fetch call, got', fetchCallCount);
  }

  // Reset for next test
  fetchCallCount = 0;

  // Test 2: Request object handling
  const req1 = new Request('https://api.example.com/data2');
  const req2 = new Request('https://api.example.com/data2');

  const p3 = dedupedFetch(req1);
  const p4 = dedupedFetch(req2);

  await Promise.all([p3, p4]);

  if (fetchCallCount === 1) {
    console.log('✅ Request objects deduplicated successfully.');
  } else {
    console.error('❌ Expected 1 fetch call for Request objects, got', fetchCallCount);
  }

  // Reset for next test
  fetchCallCount = 0;

  // Test 3: POST requests are NOT deduplicated
  const p5 = dedupedFetch('https://api.example.com/data', { method: 'POST' });
  const p6 = dedupedFetch('https://api.example.com/data', { method: 'POST' });

  await Promise.all([p5, p6]);

  if (fetchCallCount === 2) {
    console.log('✅ POST requests are correctly NOT deduplicated.');
  } else {
    console.error('❌ Expected 2 fetch calls for POST, got', fetchCallCount);
  }
}

runTest();
