import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { fileURLToPath } from 'url';

// Add global polyfills for pdfjs-dist used by pdf-parse
global.DOMMatrix = class DOMMatrix {};
global.ImageData = class ImageData {};
global.Path2D = class Path2D {};

// Mock pdf-parse before importing server
import { vi } from 'vitest';
vi.mock('pdf-parse', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return Promise.resolve({ text: 'mock text' });
    }),
    PDFParse: class MockPDFParse {
      getText() {
        return Promise.resolve({ text: 'mock text' });
      }
    }
  };
});

import app from '../../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

describe('Upload Endpoint Regression Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  });

  it('should clean up temporary files for unsupported file types', async () => {
    const dummyPath = path.join(__dirname, 'dummy.docx');
    fs.writeFileSync(dummyPath, 'garbage data');

    // Note count before upload
    const countBefore = fs.readdirSync(UPLOADS_DIR).length;

    const res = await request(app)
      .post('/api/upload')
      .attach('documents', dummyPath);

    expect(res.status).toBe(200);
    expect(res.body.failed[0].error).toBe('Unsupported file type');

    // The core regression test: Check file count after failed upload
    const countAfter = fs.readdirSync(UPLOADS_DIR).length;
    expect(countAfter).toBe(countBefore);

    if (fs.existsSync(dummyPath)) {
      fs.unlinkSync(dummyPath);
    }
  });

  it('should clean up temporary files when parsing throws an exception', async () => {
    const corruptedPath = path.join(__dirname, 'corrupted.pdf');
    fs.writeFileSync(corruptedPath, 'garbage pdf data');

    // Note count before upload
    const countBefore = fs.readdirSync(UPLOADS_DIR).length;

    const res = await request(app)
      .post('/api/upload')
      .attach('documents', corruptedPath);

    expect(res.status).toBe(200);
    expect(res.body.failed[0].error).toContain('PDF Parsing failed');

    // Regression check
    const countAfter = fs.readdirSync(UPLOADS_DIR).length;
    expect(countAfter).toBe(countBefore);

    if (fs.existsSync(corruptedPath)) {
      fs.unlinkSync(corruptedPath);
    }
  });
});
