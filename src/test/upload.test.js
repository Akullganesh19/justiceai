import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

describe('File Upload Endpoint (Sentinel Regression)', () => {
  let testFilePath;
  let testFileName = 'sentinel-attack.xyz';

  beforeAll(() => {
    // Ensure uploads directory exists before test
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Create an unsupported dummy file
    testFilePath = path.join(ROOT_DIR, testFileName);
    fs.writeFileSync(testFilePath, 'malicious or invalid data payload');

    // Mute the console error to prevent test output noise
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Clean up dummy file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    vi.restoreAllMocks();
  });

  it('should clean up the temporary file when uploading an unsupported file type', async () => {
    // Note: multer fileFilter blocks .xyz from even reaching the route handler.
    // To test the finally block in the route handler, we can mock `path.extname`
    // or just let it fail and assert the file is gone. But wait, if multer blocks it,
    // it DOES NOT create a file on disk?
    // Wait, multer fileFilter throws an error which Express catches and returns 500.

    // Let's test with a valid extension but invalid content (PDF parser throws).
    const badPdfName = 'bad-pdf.pdf';
    const badPdfPath = path.join(ROOT_DIR, badPdfName);
    fs.writeFileSync(badPdfPath, 'not a real pdf');

    const beforeUploads = fs.readdirSync(UPLOADS_DIR);

    const response = await request(app)
      .post('/api/upload')
      .attach('documents', badPdfPath);

    // It should process the file, PDF parsing fails, it adds to failedFiles, returns 200.
    expect(response.status).toBe(200);

    const isFailed = response.body.failed.some(f => f.name === badPdfName);
    expect(isFailed).toBe(true);

    const afterUploads = fs.readdirSync(UPLOADS_DIR);
    expect(afterUploads.length).toBe(beforeUploads.length);

    if (fs.existsSync(badPdfPath)) {
      fs.unlinkSync(badPdfPath);
    }
  });
});
