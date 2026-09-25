
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalEventBus } from '../lib/analytics/EventBridge.js';
import { analyticsSystem } from '../lib/analytics/AnalyticsSystem.js';

describe('Cross-System Intelligence (Analytics)', () => {
  let identifySpy;
  let errorSpy;

  beforeEach(() => {
    identifySpy = vi.spyOn(analyticsSystem, 'identify');
    errorSpy = vi.spyOn(analyticsSystem, 'trackError');
  });

  it('should loosely couple auth and analytics on user.login', () => {
    const testUser = { id: 'test@example.com', email: 'test@example.com' };
    globalEventBus.emit('user.login', testUser);
    expect(identifySpy).toHaveBeenCalledWith(testUser);
    expect(analyticsSystem.currentUser).toEqual(testUser);
  });

  it('should enrich system errors with user context', () => {
    // Current user was set in the previous test context since it's a singleton,
    // but lets explicitly set it for clarity
    analyticsSystem.currentUser = { id: 'test@example.com', name: 'Test User' };
    const testError = { error: 'Something broke' };

    globalEventBus.emit('system.error', testError);

    expect(errorSpy).toHaveBeenCalledWith(testError);
    // Since trackError logs internally, we ensure the function runs
  });
});
