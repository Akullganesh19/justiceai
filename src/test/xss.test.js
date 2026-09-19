import { describe, it, expect } from 'vitest';
import { xssMiddleware } from '../middleware/xss.js';

describe('XSS Middleware Sanitization', () => {
  it('correctly sanitizes inputs and maps HTML entities', () => {
    const req = {
      body: { message: "<script>alert('XSS')</script>" },
      query: { q: 'hello "world" &' }
    };
    const res = {};
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    xssMiddleware(req, res, next);

    expect(nextCalled).toBe(true);
    expect(req.body.message).toBe("&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;");
    expect(req.query.q).toBe("hello &quot;world&quot; &amp;");
  });
});
