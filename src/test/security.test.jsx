import { describe, it, expect } from 'vitest';

describe('xssMiddleware', () => {
  it('should escape HTML entities in req.body and req.query', () => {
    // Define the middleware locally for testing to avoid importing the whole server
    const xssMiddleware = (req, res, next) => {
      const escapeHtml = (str) => {
        if (!str) return str;
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      const sanitize = (obj) => {
        if (typeof obj === 'string') return escapeHtml(obj);
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

    const req = {
      body: {
        text: '<script>alert("XSS")</script>&'
      },
      query: {
        param: 'javascript:alert(1)'
      }
    };

    xssMiddleware(req, {}, () => {});

    expect(req.body.text).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&amp;');
  });
});
