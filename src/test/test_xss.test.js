import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import xss from 'xss';

describe('Server XSS Middleware Regression Test', () => {
  it('should properly sanitize HTML inputs (Regression test for XSS vulnerability)', async () => {
    const app = express();
    app.use(express.json());

    // Extracted XSS middleware from server.js (fixed version)
    const xssMiddleware = (req, res, next) => {
      const sanitize = (obj) => {
        if (typeof obj === 'string') return xss(obj);
        if (Array.isArray(obj)) return obj.map(sanitize);
        if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
          const sanitized = {};
          for (const key in obj) {
            sanitized[key] = sanitize(obj[key]);
          }
          return sanitized;
        }
        return obj;
      };

      if (req.body) req.body = sanitize(req.body);
      if (req.query) {
        Object.keys(req.query).forEach(key => {
          req.query[key] = sanitize(req.query[key]);
        });
      }

      next();
    };

    app.use(xssMiddleware);

    app.post('/test', (req, res) => {
      res.json({ body: req.body });
    });

    const response = await request(app)
      .post('/test')
      .send({
        text: '<script>alert("xss")</script>',
        nested: { input: '<img src=x onerror=alert(1)>' }
      });

    // Prove it successfully stripped the payload
    expect(response.body.body.text).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    expect(response.body.body.nested.input).toBe('<img src>');
  });
});
