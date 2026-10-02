/* global process */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Server Integration Tests', () => {
  let serverProcess;
  const PORT = 3005; // Use a different port to avoid conflicts
  const BASE_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    // Start the server
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT, ADMIN_SECRET: 'test-secret' },
      cwd: path.resolve(__dirname, '../../'),
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  describe('Authorization on Destructive Endpoints', () => {
    it('should return 401 Unauthorized for DELETE /api/documents without auth header', async () => {
      const response = await fetch(`${BASE_URL}/api/documents`, {
        method: 'DELETE',
      });
      expect(response.status).toBe(401);
    });

    it('should return 403 Forbidden for DELETE /api/documents with wrong secret', async () => {
      const response = await fetch(`${BASE_URL}/api/documents`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'wrong-secret'
        }
      });
      expect(response.status).toBe(403);
    });

    it('should return 401 Unauthorized for POST /api/upload without auth header', async () => {
      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
      });
      expect(response.status).toBe(401);
    });
  });

  describe('Global Error Handling', () => {
    it('should return 400 Bad Request for malformed URI', async () => {
      const response = await fetch(`${BASE_URL}/api/documents/%`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'test-secret'
        }
      });
      expect(response.status).toBe(400);
    });
  });
});
