/* global process */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_PATH = path.resolve(__dirname, '../../server.js');

describe('Server Authentication Tests', () => {
  let serverProcess;
  const PORT = 3012; // Use a different port to avoid conflicts
  const BASE_URL = `http://localhost:${PORT}/api`;
  const ADMIN_SECRET = 'test-secret-key';

  beforeAll(async () => {
    // Start the server as a child process
    serverProcess = spawn('node', [SERVER_PATH], {
      env: {
        ...process.env,
        PORT: PORT,
        ADMIN_SECRET: ADMIN_SECRET,
        NODE_ENV: 'test',
        OLLAMA_BASE_URL: 'http://localhost:11434', // Dummy URL to bypass initial check
      },
    });

    // Wait for server to start
    await new Promise((resolve, reject) => {
      let output = '';
      serverProcess.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes(`JusticeAI RAG Server running on port`)) {
          resolve();
        }
      });
      serverProcess.stderr.on('data', (data) => {
        console.error(`Server stderr: ${data}`);
      });
      serverProcess.on('error', (err) => {
        reject(err);
      });

      // Fallback timeout in case output doesn't match exactly
      setTimeout(resolve, 3000);
    });
  }, 10000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  describe('DELETE /api/documents', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'DELETE',
      });
      expect(response.status).toBe(401);
    });

    it('should reject requests with wrong secret', async () => {
      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'wrong-secret'
        }
      });
      expect(response.status).toBe(401);
    });

    it('should allow authenticated requests', async () => {
      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'DELETE',
        headers: {
          'Authorization': ADMIN_SECRET
        }
      });
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/upload', () => {
    it('should reject unauthenticated requests', async () => {
      const formData = new FormData();
      const fileBlob = new Blob(['test content'], { type: 'text/plain' });
      formData.append('documents', fileBlob, 'test.txt');

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      expect(response.status).toBe(401);
    });
  });
});
