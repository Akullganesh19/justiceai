import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import waitOn from 'wait-on';

describe('Admin Authentication Middleware', () => {
  let serverProcess;
  const PORT = 3005;
  const secret = 'test-secret';
  const wrongSecret = 'wrong-secret';
  const baseUrl = `http://localhost:${PORT}`;

  beforeAll(async () => {
    serverProcess = spawn('node', ['server.js'], {
      env: {
        ...process.env,
        ADMIN_SECRET: secret,
        PORT: PORT.toString(),
        NODE_ENV: 'test'
      }
    });

    await waitOn({
      resources: [`http://localhost:${PORT}/api/health`],
      timeout: 10000,
    });
  }, 15000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should return 401 for unauthenticated request to /api/documents', async () => {
    const res = await fetch(`${baseUrl}/api/documents`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });

  it('should return 401 for authenticated request with wrong secret', async () => {
    const res = await fetch(`${baseUrl}/api/documents`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${wrongSecret}` }
    });
    expect(res.status).toBe(401);
  });

  it('should return 200 for authenticated request with correct secret', async () => {
    const res = await fetch(`${baseUrl}/api/documents`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${secret}` }
    });
    expect(res.status).toBe(200);
  });
});
