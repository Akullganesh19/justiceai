import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import waitOn from 'wait-on';

/* global process */

describe('Admin Auth Endpoints', () => {
  let serverProcess;
  const PORT = 3009; // Use a different port to avoid conflicts
  const BASE_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    // Start the Express server
    serverProcess = spawn('node', ['server.js'], {
      env: {
        ...process.env,
        PORT,
        ADMIN_SECRET: 'test-secret',
        NODE_ENV: 'test',
        OLLAMA_BASE_URL: 'http://localhost:11434',
        EMBEDDING_MODEL: 'test-model',
        CHAT_MODEL: 'test-chat-model',
      },
    });

    // Wait for the server to be ready
    await waitOn({
      resources: [`tcp:localhost:${PORT}`],
      timeout: 10000,
    });
  }, 15000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  describe('DELETE /api/documents', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await fetch(`${BASE_URL}/api/documents`, {
        method: 'DELETE',
      });
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain('Unauthorized');
    });

    it('should reject requests with invalid secret', async () => {
      const response = await fetch(`${BASE_URL}/api/documents`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer wrong-secret',
        },
      });
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toContain('Forbidden');
    });

    it('should allow requests with valid secret', async () => {
      const response = await fetch(`${BASE_URL}/api/documents`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'test-secret',
        },
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toContain('Cleared');
    });

    it('should allow requests with valid secret (Bearer token)', async () => {
      const response = await fetch(`${BASE_URL}/api/documents`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer test-secret',
        },
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toContain('Cleared');
    });
  });

  describe('DELETE /api/documents/:source', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await fetch(`${BASE_URL}/api/documents/test-source`, {
        method: 'DELETE',
      });
      expect(response.status).toBe(401);
    });

    it('should allow requests with valid secret', async () => {
      const response = await fetch(`${BASE_URL}/api/documents/test-source`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer test-secret',
        },
      });
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/upload', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
      });
      expect(response.status).toBe(401);
    });

    // We do not fully test the upload process here as it requires mocked files,
    // we only verify the middleware rejection.
  });
});
