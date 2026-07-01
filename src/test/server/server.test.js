/* global process */
/* eslint-env node */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../server.js';
import fs from 'fs';
import path from 'path';

describe('Server Advesarial Tests', () => {
  it('should not leak files on disk for unsupported upload types', async () => {
    const dummyPath = path.join(process.cwd(), 'test-unsupported.docx');
    fs.writeFileSync(dummyPath, 'dummy content');

    const res = await request(app)
      .post('/api/upload')
      .attach('documents', dummyPath);

    expect(res.status).toBe(200);
    expect(res.body.failed[0].error).toBe('Unsupported file type');

    // Check uploads dir
    const uploads = fs.readdirSync(path.join(process.cwd(), 'uploads'));
    const leaked = uploads.some(f => f.includes('test-unsupported.docx') || f.includes('documents-'));
    expect(leaked).toBe(false); // Should be cleaned up

    fs.unlinkSync(dummyPath);
  });

  it('should sanitize api key from chat error messages', async () => {
    // We send a request to trigger an error
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: 'test error leak' }]
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('An error occurred');

    if (res.body.details) {
      expect(res.body.details).not.toMatch(/api_key:[a-zA-Z0-9_-]{10,}/);
      expect(res.body.details).toContain('api_key:REDACTED');
    }
  });

});
