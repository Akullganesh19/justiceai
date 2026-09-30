import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import http from 'http';


describe('Sentinel Security and Stability Tests', () => {
  let serverProcess;
  const PORT = 3008;
  const SECRET = 'sentinel-test-secret';

  beforeAll(async () => {
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT, ADMIN_SECRET: SECRET }
    });
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should reject unauthenticated DELETE to /api/documents', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/documents`, {
      method: 'DELETE'
    });
    expect(res.status).toBe(401);
  });

  it('should reject unauthenticated DELETE to /api/documents/:source', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/documents/test.txt`, {
      method: 'DELETE'
    });
    expect(res.status).toBe(401);
  });

  it('should accept authenticated DELETE to /api/documents', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/documents`, {
      method: 'DELETE',
      headers: { 'Authorization': SECRET }
    });
    expect(res.status).toBe(200);
  });

  it('should reject unauthenticated POST to /api/upload', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/upload`, {
      method: 'POST'
    });
    expect(res.status).toBe(401);
  });

  it('should handle malformed URIs with 400 Bad Request', async () => {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/documents/%',
        method: 'DELETE',
        headers: { 'Authorization': SECRET }
      }, (res) => {
        try {
          expect(res.statusCode).toBe(400);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
      req.end();
    });
  });
});
