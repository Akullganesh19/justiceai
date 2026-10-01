import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';
/* global process */
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Sentinel Regression Tests', () => {
  let serverProcess;
  const PORT = 3005; // Use a different port to avoid conflicts
  const BASE_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    // Start the server
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT.toString(), ADMIN_SECRET: 'test-secret' },
      cwd: path.resolve(__dirname, '../../')
    });

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }, 10000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  describe('Trust Boundary (Authorization)', () => {
    it('should reject unauthenticated DELETE /api/documents', async () => {
      const res = await fetch(`${BASE_URL}/api/documents`, {
        method: 'DELETE'
      });

      // Before fix: This returns 200 (Vulnerable)
      // After fix: This should return 401 or 403
      expect(res.status).not.toBe(200);
      expect([401, 403]).toContain(res.status);
    });

    it('should reject unauthenticated DELETE /api/documents/:source', async () => {
      const res = await fetch(`${BASE_URL}/api/documents/test.pdf`, {
        method: 'DELETE'
      });

      // Before fix: This returns 200 (Vulnerable)
      // After fix: This should return 401 or 403
      expect(res.status).not.toBe(200);
      expect([401, 403]).toContain(res.status);
    });
  });

  describe('Input Adversarial Testing (Failure Injection)', () => {
    it('should gracefully handle malformed URI parameters', async () => {
      const res = await fetch(`${BASE_URL}/api/documents/%`, {
        method: 'GET'
      });

      // Before fix: This throws a 500 error due to URIError in decodeURIComponent
      // After fix: This should return a 400 Bad Request
      expect(res.status).toBe(400);
    });

    it('should handle payload too large errors gracefully', async () => {
      const largeBody = JSON.stringify({ data: 'A'.repeat(12 * 1024 * 1024) });
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: largeBody
      });

      // Before fix: This throws a 500 error
      // After fix: This should return a 413 Payload Too Large
      expect(res.status).toBe(413);
    });
  });
});
