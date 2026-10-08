import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalEventBus } from './EventBridge.js';
import { analyticsSystem } from './AnalyticsSystem.js';

describe('Cross-System Connection: Auth ↔ Analytics via EventBridge', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should loosely couple Auth and Analytics through EventBridge', () => {
    const identifySpy = vi.spyOn(analyticsSystem, 'identify');

    // Simulate Auth firing an event without knowing about Analytics
    globalEventBus.emit('user.login', { email: 'test@justiceai.law' });

    // Verify Analytics received it without Auth directly calling it
    expect(identifySpy).toHaveBeenCalledWith('test@justiceai.law');
    expect(analyticsSystem.currentUser).toBe('test@justiceai.law');
  });

  it('should loosely couple ErrorBoundary and Analytics through EventBridge', () => {
    const trackSpy = vi.spyOn(analyticsSystem, 'trackError');
    analyticsSystem.currentUser = 'test@justiceai.law';

    // Simulate ErrorBoundary firing an event
    const errorContext = { error: 'Test Error', stack: 'Test Stack' };
    globalEventBus.emit('system.error', errorContext);

    // Verify Analytics received it and enriched it with the current user context
    expect(trackSpy).toHaveBeenCalledWith(errorContext);
  });
});
