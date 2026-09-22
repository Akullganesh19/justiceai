/* global process */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';

let serverProcess;
const PORT = 3005; // Use a different port for tests
const BASE_URL = `http://localhost:${PORT}`;

describe('Server DoS and Error Handling Regression Tests', () => {
  beforeAll(async () => {
    // Start the server in the background
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT.toString() }
    });

    // Wait for the server to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
  }, 10000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should return 413 for JSON payloads exceeding 10MB', async () => {
    const largeString = "a".repeat(11 * 1024 * 1024); // 11MB string

    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: largeString }] })
    });

    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toBe('Payload Too Large');
  });

  it('should return 400 for malformed URI parameters instead of crashing', async () => {
    const res = await fetch(`${BASE_URL}/api/documents/%c0%af`, {
      method: 'DELETE'
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Bad Request');
    expect(data.message).toBe('Malformed URI component');
  });
});

describe('Embedding Endpoint DoS Protection', () => {
  let serverProcess2;
  beforeAll(async () => {
    serverProcess2 = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: (PORT+1).toString() }
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
  }, 10000);

  afterAll(() => {
    if (serverProcess2) serverProcess2.kill();
  });

  it('should return 413 for message content exceeding reasonable lengths', async () => {
    // 9MB string, passes body parser but should be caught by content length validator
    const largeString = "a".repeat(9 * 1024 * 1024);

    const res = await fetch(`http://localhost:${PORT+1}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: largeString }] })
    });

    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toBe('Payload Too Large');
    expect(data.message).toBe('Message content exceeds maximum allowed length');
  });
});

describe('Destructive Endpoints Auth Protection', () => {
  let serverProcess3;
  beforeAll(async () => {
    serverProcess3 = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: (PORT+2).toString() }
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
  }, 10000);

  afterAll(() => {
    if (serverProcess3) serverProcess3.kill();
  });

  it('should return 401 when trying to clear documents without auth', async () => {
    const res = await fetch(`http://localhost:${PORT+2}/api/documents`, {
      method: 'DELETE'
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });
});
