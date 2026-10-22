import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3020;
const API_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('Starting server...');
  const server = spawn('node', ['server.js'], {
    env: { ...process.env, PORT, NODE_ENV: 'test', ADMIN_SECRET: 'test_secret' },
    cwd: path.resolve(__dirname, '../../..')
  });

  // wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  let failed = false;

  try {
    console.log('Testing unauthenticated access...');
    const res1 = await fetch(`${API_URL}/api/documents`, { method: 'DELETE' });
    if (res1.status !== 401) {
      console.error(`❌ Expected 401, got ${res1.status}`);
      failed = true;
    }

    console.log('Testing authenticated access...');
    const res2 = await fetch(`${API_URL}/api/documents`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer test_secret' }
    });
    if (res2.status !== 200) {
      console.error(`❌ Expected 200, got ${res2.status}`);
      failed = true;
    }
  } catch (err) {
    console.error(err);
    failed = true;
  } finally {
    server.kill();
    if (failed) {
      console.log('Tests failed.');
      process.exit(1);
    } else {
      console.log('Tests passed.');
      process.exit(0);
    }
  }
}

runTests();
