import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Sentinel Security Verification', () => {
  it('should not leak files on unsupported file upload', async () => {
    const testFile = path.join(__dirname, 'test-doc.doc');
    fs.writeFileSync(testFile, 'This is a test document.');

    const res = await request(app)
      .post('/api/upload')
      .attach('documents', testFile);

    expect(res.status).toBe(200);
    expect(res.body.failed[0].error).toBe('Unsupported file type');

    const uploadsDir = path.join(__dirname, '../../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      expect(files.filter(f => f.endsWith('.doc')).length).toBe(0);
    }

    fs.unlinkSync(testFile);
  });

  it('should not crash on invalid messages array content type', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: ['this', 'is', 'an', 'array'] }]
      });

    expect(res.status).toBeDefined();
  });
});
