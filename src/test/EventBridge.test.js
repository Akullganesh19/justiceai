import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalEventBus } from '../lib/analytics/EventBridge.js';

describe('EventBridge', () => {
  beforeEach(() => {
    // Clear all listeners before each test
    globalEventBus.listeners = new Map();
  });

  it('should register listeners and emit events', () => {
    const callback = vi.fn();
    globalEventBus.on('test.event', callback);

    globalEventBus.emit('test.event', { foo: 'bar' });

    expect(callback).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should support removing listeners', () => {
    const callback = vi.fn();
    const unsubscribe = globalEventBus.on('test.event', callback);

    unsubscribe();
    globalEventBus.emit('test.event', { foo: 'bar' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should safely execute multiple listeners even if one throws', () => {
    const callback1 = vi.fn().mockImplementation(() => {
      throw new Error('Listener error');
    });
    const callback2 = vi.fn();

    globalEventBus.on('test.event', callback1);
    globalEventBus.on('test.event', callback2);

    globalEventBus.emit('test.event', { data: 123 });

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });
});
