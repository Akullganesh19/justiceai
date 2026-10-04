/* global process */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminAuth } from '../middleware/adminAuth.js';

describe('adminAuth middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    process.env.ADMIN_SECRET = 'test-secret';
  });

  it('should return 401 if Authorization header is missing', () => {
    adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing Authorization header' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if Authorization header is invalid format', () => {
    req.headers.authorization = 'InvalidSecret';
    adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if Authorization header is valid', () => {
    req.headers.authorization = 'Bearer test-secret';
    adminAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
