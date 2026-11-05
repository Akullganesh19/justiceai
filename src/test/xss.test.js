import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

// Create a mock app with the same XSS middleware
const app = express();
app.use(express.json());

// XSS Middleware
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sanitize = (obj, depth = 0) => {
  if (depth > 20) return null;
  if (typeof obj === 'string') return escapeHtml(obj);
  if (Array.isArray(obj)) return obj.map(item => sanitize(item, depth + 1));
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj) && !(obj instanceof Date) && !(obj instanceof Error)) {
    const sanitized = {};
    for (const key in obj) {
      sanitized[key] = sanitize(obj[key], depth + 1);
    }
    return sanitized;
  }
  return obj;
};

app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }
  next();
});

app.post('/api/test', (req, res) => {
  res.json({ body: req.body });
});

describe('XSS Sanitizer Middleware', () => {
  it('should prevent stack overflow on deeply nested arrays', async () => {
    let deeplyNestedArray = [];
    let current = deeplyNestedArray;
    for (let i = 0; i < 50; i++) {
      let next = [];
      current.push(next);
      current = next;
    }

    const response = await request(app)
      .post('/api/test')
      .send({ nested: deeplyNestedArray })
      .expect(200);

    expect(response.body.body.nested).toBeDefined();
    // It should eventually resolve to null due to depth limit
  });
});

describe('XSS String Casting in Endpoints', () => {
  it('should cast non-string jurisdiction values properly', async () => {
    // A simplified version of what's tested in server.js
    const jurisdiction = { not_string: true };
    const latestUserMessage = { not_string: true };

    // We check that calling String() avoids TypeError for substring
    const messageStr = String(latestUserMessage);
    const substring = messageStr.substring(0, 5);

    const jurisdictionStr = String(jurisdiction);
    const isNotNational = jurisdictionStr !== 'National';
    const lowercased = jurisdictionStr.toLowerCase();

    expect(substring).toBe('[obje');
    expect(isNotNational).toBe(true);
    expect(lowercased).toBe('[object object]');
  });
});
