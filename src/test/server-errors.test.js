import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../server.js';

describe('Server Error Handlers', () => {
  it('returns generic error on Bhashini error', async () => {
    // Send a malformed payload to trigger error in Bhashini route
    const response = await request(app)
      .post('/api/voice/process')
      .send({ task: 'asr' }); // missing audioContent should trigger error

    // Should not leak details
    expect(response.body).toHaveProperty('error', 'Internal Server Error');
  });
});
