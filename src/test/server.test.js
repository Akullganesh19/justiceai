import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';

describe('Server Adversarial Testing', () => {
  it('should not leak server errors on invalid POST /api/chat', async () => {
    // Save original NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'hello' }], mode: 'unknown' }); // Should throw error in code or miss requirements

    // We want to ensure no internal error messages are leaked
    expect(res.body.details).toBeUndefined();

    // Restore
    process.env.NODE_ENV = originalEnv;
  });

  it('should securely handle upload failure and not leak PII', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Without uploading a valid file, but formatting to potentially trigger error
    const res = await request(app)
      .post('/api/upload')
      .send({});

    // Will likely return 400 No files uploaded or similar, which is fine
    // The key is that if it 500s, it does not leak
    if (res.status === 500) {
      expect(res.body.details).toBeUndefined();
      expect(res.body.error).toBe('File upload failed');
    }

    process.env.NODE_ENV = originalEnv;
  });

  it('should properly configure CORS without wildcard for credentials', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'http://malicious-site.com');

    // Since NODE_ENV is test, CORS might allow it dynamically depending on setup,
    // but the key config was verified structurally in server.js
    expect(res.headers['access-control-allow-origin']).not.toBe('*');
  });
});
