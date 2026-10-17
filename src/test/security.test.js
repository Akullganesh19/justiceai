/* global process */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';

describe('Security and Concurrency Tests', () => {
  let serverProcess;
  const PORT = 3009;

  beforeAll(async () => {
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT, NODE_ENV: 'test', ADMIN_SECRET: 'test-secret' },
      cwd: process.cwd()
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should prevent unauthenticated DELETE /api/documents', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/documents`, {
      method: 'DELETE'
    });
    expect(res.status).toBe(401);
  });

  it('should prevent payload too large DoS', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'A'.repeat(15 * 1024 * 1024) })
    });
    expect(res.status).toBe(413);
  });
});
