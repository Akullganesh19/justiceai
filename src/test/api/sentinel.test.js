import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { app } from '../../../server.js'; // Note: server.js exports app

// Ensure uploads dir exists for the test if it somehow doesn't
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

describe('Sentinel Regression Tests', () => {
  describe('Upload Resource Leak (/api/upload)', () => {
    it('should clean up files when parsing throws an error', async () => {
      const brokenPdfPath = path.join(process.cwd(), 'broken_test.pdf');
      fs.writeFileSync(brokenPdfPath, 'This is definitely not a PDF');

      const res = await request(app)
        .post('/api/upload')
        .attach('documents', brokenPdfPath);

      // Cleanup the test file
      fs.unlinkSync(brokenPdfPath);

      // We expect the file to be processed as an error in failedFiles
      expect(res.status).toBe(200);
      expect(res.body.failed).toBeInstanceOf(Array);
      expect(res.body.failed.length).toBeGreaterThan(0);
      expect(res.body.failed[0].error).toMatch(/PDF Parsing failed/i);

      // Verification that the actual uploaded file was removed from the uploads directory
      // Supertest handles the upload, multer saves it to `uploads/`. We need to verify
      // the uploads dir doesn't contain leftover test files from this run.
      // Easiest is ensuring it has length 0 assuming it was empty, or at least
      // not increasing (mocking/reading). Since we run isolated tests, let's just
      // make sure uploads dir is relatively empty or no "broken_test" multer leftovers exist.
      // But testing for no files at all is safe if it was empty.
      const files = fs.readdirSync(UPLOADS_DIR);
      // Let's just assume no pdf files are left
      const pdfFiles = files.filter(f => f.endsWith('.pdf'));
      expect(pdfFiles.length).toBe(0);
    });
  });

  describe('Chat Endpoint Crash (/api/chat)', () => {
    it('should handle malformed message content without crashing (500)', async () => {
      // 1. Array missing content
      const res1 = await request(app)
        .post('/api/chat')
        .send({ messages: [{ role: 'user' }] });

      expect(res1.status).toBe(400);
      expect(res1.body.error).toBe('Latest message content is missing');

      // 2. Null element
      const res2 = await request(app)
        .post('/api/chat')
        .send({ messages: [null] });

      expect(res2.status).toBe(400);
      expect(res2.body.error).toBe('Latest message content is missing');
    });
  });
});
