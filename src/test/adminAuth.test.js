import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';

let serverProcess;
const PORT = 3005;

describe('Admin Authentication Tests', () => {
  beforeAll(async () => {
    // Start the server for tests
    serverProcess = spawn('node', ['server.js'], {
      env: {
        ...process.env,
        PORT,
        ADMIN_SECRET: 'test-secret',
        NODE_ENV: 'test'
      },
    });

    // Wait for the server to spin up
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  const endpoints = [
    { method: 'POST', path: '/api/upload', body: 'dummy' },
    { method: 'DELETE', path: '/api/documents/test-source' },
    { method: 'DELETE', path: '/api/documents' }
  ];

  for (const endpoint of endpoints) {
    describe(`${endpoint.method} ${endpoint.path}`, () => {
      it('should return 401 Unauthorized without auth header', async () => {
        const res = await fetch(`http://localhost:${PORT}${endpoint.path}`, {
          method: endpoint.method,
          body: endpoint.body,
        });
        expect(res.status).toBe(401);
      });

      it('should return 401 Unauthorized with invalid token', async () => {
        const res = await fetch(`http://localhost:${PORT}${endpoint.path}`, {
          method: endpoint.method,
          body: endpoint.body,
          headers: {
            Authorization: 'Bearer wrong-secret'
          }
        });
        expect(res.status).toBe(401);
      });

      it('should return 400 (or pass auth middleware) with valid token', async () => {
        const res = await fetch(`http://localhost:${PORT}${endpoint.path}`, {
          method: endpoint.method,
          body: endpoint.body,
          headers: {
            Authorization: 'Bearer test-secret'
          }
        });
        // We expect it to pass auth and hit the route logic.
        // For upload, it'll hit the missing files check (400).
        // For delete, it should execute and return 200.
        expect([200, 400]).toContain(res.status);
      });
    });
  }
});
