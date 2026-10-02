/* global process */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminAuth } from '../../middleware/adminAuth.js';

describe('adminAuth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();

    // Reset process.env for each test
    process.env.NODE_ENV = 'test';
    delete process.env.ADMIN_SECRET;
  });

  it('should return 500 if ADMIN_SECRET is missing in production environment', () => {
    process.env.NODE_ENV = 'production';
    adminAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server misconfiguration: ADMIN_SECRET not set in production' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header is missing', () => {
    process.env.NODE_ENV = 'development';
    adminAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized: Missing or invalid token format' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header is not Bearer format', () => {
    process.env.NODE_ENV = 'development';
    mockReq.headers.authorization = 'Basic token123';
    adminAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized: Missing or invalid token format' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if token does not match expected secret', () => {
    process.env.NODE_ENV = 'development';
    mockReq.headers.authorization = 'Bearer wrongtoken';
    adminAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden: Invalid admin token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() if token matches default development secret', () => {
    process.env.NODE_ENV = 'development';
    mockReq.headers.authorization = 'Bearer default_dev_secret';
    adminAuth(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should call next() if token matches ADMIN_SECRET in environment', () => {
    process.env.NODE_ENV = 'production';
    process.env.ADMIN_SECRET = 'my_super_secret';
    mockReq.headers.authorization = 'Bearer my_super_secret';
    adminAuth(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
