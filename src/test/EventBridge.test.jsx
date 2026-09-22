import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalEventBus } from '../lib/analytics/EventBridge.js';

describe('EventBridge', () => {
  beforeEach(() => {
    // Clear out listeners for tests
    globalEventBus.listeners = {};
    globalEventBus.context = { sessionId: 'test-session', user: null };
  });

  it('should emit events to subscribers', () => {
    const callback = vi.fn();
    globalEventBus.on('test.event', callback);

    globalEventBus.emit('test.event', { message: 'hello' });

    expect(callback).toHaveBeenCalledTimes(1);
    const payload = callback.mock.calls[0][0];
    expect(payload.message).toBe('hello');
  });

  it('should append shared context to emitted events', () => {
    const callback = vi.fn();
    globalEventBus.on('test.event', callback);

    globalEventBus.setContext('user', { id: 'u1' });
    globalEventBus.emit('test.event', { data: 123 });

    expect(callback).toHaveBeenCalledTimes(1);
    const payload = callback.mock.calls[0][0];
    expect(payload.context.user).toEqual({ id: 'u1' });
    expect(payload.context.sessionId).toBe('test-session');
  });

  it('should support unsubscribing', () => {
    const callback = vi.fn();
    const unsubscribe = globalEventBus.on('test.event', callback);

    unsubscribe();
    globalEventBus.emit('test.event', { data: 123 });

    expect(callback).not.toHaveBeenCalled();
  });
});
