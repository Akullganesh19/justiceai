import { describe, it, expect, vi } from 'vitest';
import { EventBridge } from '../lib/analytics/EventBridge';

describe('EventBridge', () => {
  it('should allow pub/sub communication', () => {
    const bus = new EventBridge();
    const callback = vi.fn();

    bus.on('test.event', callback);
    bus.emit('test.event', { foo: 'bar' });

    expect(callback).toHaveBeenCalledWith({ foo: 'bar' });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow unsubscribing', () => {
    const bus = new EventBridge();
    const callback = vi.fn();

    const unsubscribe = bus.on('test.event', callback);
    unsubscribe();

    bus.emit('test.event', { foo: 'bar' });
    expect(callback).not.toHaveBeenCalled();
  });

  it('should survive throwing callbacks', () => {
    const bus = new EventBridge();
    const badCallback = vi.fn(() => { throw new Error('Oops'); });
    const goodCallback = vi.fn();

    bus.on('test.event', badCallback);
    bus.on('test.event', goodCallback);

    // Original console.error mocked to keep test output clean
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    bus.emit('test.event', { foo: 'bar' });

    expect(badCallback).toHaveBeenCalled();
    expect(goodCallback).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
