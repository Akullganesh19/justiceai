import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { enrichErrorReport, initTelemetryBridge } from '../lib/telemetryBridge';

describe('telemetryBridge', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('enrichErrorReport', () => {
    it('returns anonymous user when no auth data is in localStorage', () => {
      const errorData = { message: 'Test Error' };
      const enriched = enrichErrorReport(errorData);

      expect(enriched).toEqual({
        message: 'Test Error',
        userId: 'anonymous',
        userName: 'Anonymous'
      });
    });

    it('enriches error data with auth info from localStorage', () => {
      localStorage.setItem('justice_auth_user', JSON.stringify({ email: 'test@example.com', name: 'Test User' }));

      const errorData = { message: 'Another Error' };
      const enriched = enrichErrorReport(errorData);

      expect(enriched).toEqual({
        message: 'Another Error',
        userId: 'test@example.com',
        userName: 'Test User'
      });
    });
  });

  describe('initTelemetryBridge', () => {
    it('listens for justice.system.error and dispatches justice.telemetry.logged', () => {
      // Setup spy for dispatchEvent
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      initTelemetryBridge();

      // Emit the error event
      const errorEvent = new CustomEvent('justice.system.error', {
        detail: { message: 'System crashed' }
      });
      window.dispatchEvent(errorEvent);

      // Check if dispatchEvent was called with our new event
      // First call is our dispatch above, second call is the bridge reacting
      expect(dispatchSpy).toHaveBeenCalledTimes(2);

      const emittedEvent = dispatchSpy.mock.calls[1][0];
      expect(emittedEvent.type).toBe('justice.telemetry.logged');
      expect(emittedEvent.detail).toEqual({
        message: 'System crashed',
        userId: 'anonymous',
        userName: 'Anonymous'
      });
    });
  });
});
