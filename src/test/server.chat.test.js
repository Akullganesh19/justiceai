import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';

describe('Server Chat API - Adversarial Verification', () => {
  let serverProcess;

  beforeAll(async () => {
    serverProcess = spawn('node', ['server.js']);
    await new Promise(resolve => setTimeout(resolve, 2500));
  }, 10000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should return 400 for array with string instead of object', async () => {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: ["just a string", { role: 'user', content: 'hello' }]
      })
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 when message content is missing', async () => {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user' }]
      })
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 when array is empty', async () => {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: []
      })
    });

    expect(res.status).toBe(400);
  });
});
