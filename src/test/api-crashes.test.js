import { describe, it, expect } from 'vitest';

describe('Server API Edge Cases', () => {
  it('should return 400 for malformed /api/chat messages (regression test)', async () => {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{role: "user", content: null}]
      })
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 for empty /api/chat messages array (regression test)', async () => {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: []
      })
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 for non-string /api/embed payload (regression test)', async () => {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('http://localhost:3001/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: {}
      })
    });
    expect(res.status).toBe(400);
  });
});
