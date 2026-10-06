/* global process */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';

describe('Server Admin Auth Middleware', () => {
  let serverProcess;

  beforeAll(async () => {
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: 3005, ADMIN_SECRET: 'testsecret' }
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should deny access to DELETE /api/documents without token', async () => {
    const res = await fetch('http://localhost:3005/api/documents', {
      method: 'DELETE'
    });
    expect(res.status).toBe(401);
  });

  it('should allow access to DELETE /api/documents with correct token', async () => {
    const res = await fetch('http://localhost:3005/api/documents', {
      method: 'DELETE',
      headers: {
        'Authorization': 'testsecret'
      }
    });
    expect(res.status).toBe(200);
  });
});
