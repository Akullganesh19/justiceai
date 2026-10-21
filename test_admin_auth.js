import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const waitOnPort = async (port, timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(`http://localhost:${port}/api/health`);
      if (res.ok) return;
    } catch (e) {
      // Ignore connection errors and wait
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout waiting for port ${port}`);
};

const runTest = async () => {
  console.log('Testing Admin Auth Middleware...');

  // 1. Test production with missing secret (should 500)
  const server1 = spawn('node', ['server.js'], { env: { ...process.env, NODE_ENV: 'production', PORT: 3006, ADMIN_SECRET: '' } });
  await waitOnPort(3006);

  const res1 = await fetch('http://localhost:3006/api/documents', {
    method: 'DELETE',
    headers: { 'Authorization': 'some-secret' }
  });

  if (res1.status !== 500) {
    console.error(`❌ Expected 500 when secret missing in prod, got ${res1.status}`);
    server1.kill();
    process.exit(1);
  } else {
    console.log('✅ Prod missing secret check passed');
  }
  server1.kill();

  // 2. Test valid configuration
  const server2 = spawn('node', ['server.js'], { env: { ...process.env, NODE_ENV: 'development', ADMIN_SECRET: 'test-secret', PORT: 3007 } });
  await waitOnPort(3007);

  // Missing header (should 401)
  const res2 = await fetch('http://localhost:3007/api/documents', { method: 'DELETE' });
  if (res2.status !== 401) {
    console.error(`❌ Expected 401 when missing header, got ${res2.status}`);
    server2.kill();
    process.exit(1);
  } else {
    console.log('✅ Missing header check passed');
  }

  // Wrong header (should 403)
  const res3 = await fetch('http://localhost:3007/api/documents', {
    method: 'DELETE',
    headers: { 'Authorization': 'wrong-secret' }
  });
  if (res3.status !== 403) {
    console.error(`❌ Expected 403 when wrong header, got ${res3.status}`);
    server2.kill();
    process.exit(1);
  } else {
    console.log('✅ Wrong header check passed');
  }

  // Correct header (should 200)
  const res4 = await fetch('http://localhost:3007/api/documents', {
    method: 'DELETE',
    headers: { 'Authorization': 'test-secret' }
  });
  if (res4.status !== 200) {
    console.error(`❌ Expected 200 with correct header, got ${res4.status}`);
    server2.kill();
    process.exit(1);
  } else {
    console.log('✅ Valid header check passed');
  }

  server2.kill();
  console.log('🎉 All tests passed!');
  process.exit(0);
};

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
