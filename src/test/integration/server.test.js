/* global process */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';

const PORT = 3009;

describe('Server Integration - Admin Auth', () => {
  let serverProcess;

  beforeAll(async () => {
    // Start the server process
    serverProcess = spawn('node', ['server.js'], {
      env: {
        ...process.env,
        PORT: PORT,
        NODE_ENV: 'test',
        ADMIN_SECRET: 'test_secret'
      }
    });

    // Wait for the server to start
    await new Promise((resolve) => {
      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('running on port')) {
          resolve();
        }
      });
    });
  }, 10000); // 10s timeout

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should block DELETE /api/documents without auth', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/documents`, {
      method: 'DELETE'
    });
    expect(res.status).toBe(401);
  });

  it('should block DELETE /api/documents with wrong auth', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/documents`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer wrong'
      }
    });
    expect(res.status).toBe(403);
  });

  it('should allow DELETE /api/documents with correct auth', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/documents`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer test_secret'
      }
    });
    expect(res.status).toBe(200);
  });
});
