import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initTelemetryBridge } from './TelemetryBridge';

describe('TelemetryBridge (Synapse)', () => {
  let cleanup;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any existing global listeners by replacing the window object (simulated via JSDOM)
    // Actually we just call cleanup if it exists, and mock localStorage
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
    }
    vi.restoreAllMocks();
  });

  it('should enrich error telemetry with anonymous user if not logged in', () => {
    cleanup = initTelemetryBridge();

    // Dispatch error event
    const event = new CustomEvent('justice-telemetry-error', {
      detail: { error: 'Test Error', componentStack: 'Stack' }
    });
    window.dispatchEvent(event);

    // Verify analytics
    const analytics = JSON.parse(localStorage.getItem('justice_ai_analytics') || '[]');
    expect(analytics).toHaveLength(1);
    expect(analytics[0].type).toBe('error');
    expect(analytics[0].data.error).toBe('Test Error');
    expect(analytics[0].data.affectedUser).toBe('anonymous_user');
    expect(analytics[0].data.enrichedAt).toBeDefined();
  });

  it('should enrich error telemetry with authenticated user email', () => {
    cleanup = initTelemetryBridge();

    // Set auth context in localStorage
    localStorage.setItem('justice_auth_user', JSON.stringify({ email: 'advocate@justiceai.law' }));

    // Dispatch error event
    const event = new CustomEvent('justice-telemetry-error', {
      detail: { error: 'Auth User Error', componentStack: 'Stack 2' }
    });
    window.dispatchEvent(event);

    // Verify analytics
    const analytics = JSON.parse(localStorage.getItem('justice_ai_analytics') || '[]');
    expect(analytics).toHaveLength(1);
    expect(analytics[0].type).toBe('error');
    expect(analytics[0].data.error).toBe('Auth User Error');
    expect(analytics[0].data.affectedUser).toBe('advocate@justiceai.law');
    expect(analytics[0].data.enrichedAt).toBeDefined();
  });

  it('should cap the analytics array at 100 events', () => {
    cleanup = initTelemetryBridge();

    // Pre-populate 100 events
    const initialAnalytics = Array(100).fill({ type: 'old', data: {} });
    localStorage.setItem('justice_ai_analytics', JSON.stringify(initialAnalytics));

    // Dispatch new error event
    const event = new CustomEvent('justice-telemetry-error', {
      detail: { error: 'Overflow Error' }
    });
    window.dispatchEvent(event);

    const analytics = JSON.parse(localStorage.getItem('justice_ai_analytics') || '[]');
    expect(analytics).toHaveLength(100);
    expect(analytics[99].type).toBe('error');
    expect(analytics[99].data.error).toBe('Overflow Error');
  });
});
