import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalEventBus } from '../lib/analytics/EventBridge';
import { analyticsSystem } from '../lib/analytics/AnalyticsSystem';

describe('AnalyticsSystem Connection', () => {
  beforeEach(() => {
    analyticsSystem.currentUser = null;
  });

  it('should store user context upon login', () => {
    globalEventBus.emit('user.login', { email: 'test@example.com' });
    expect(analyticsSystem.currentUser).toBe('test@example.com');
  });

  it('should store user context upon signup', () => {
    globalEventBus.emit('user.signup', { email: 'new@example.com' });
    expect(analyticsSystem.currentUser).toBe('new@example.com');
  });

  it('should enrich errors with user context if logged in', () => {
    // Spy on console.log where the enrichment happens in our simple setup
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Simulate login
    globalEventBus.emit('user.login', { email: 'user@justiceai.law' });

    // Simulate error
    globalEventBus.emit('system.error', { message: 'Database failure' });

    // Verify it enriched the log
    expect(consoleSpy).toHaveBeenCalledWith(
      '[AnalyticsSystem] Enriched error report:',
      expect.objectContaining({
        message: 'Database failure',
        affectedUser: 'user@justiceai.law' // The intelligence emerged!
      })
    );

    consoleSpy.mockRestore();
  });
});
