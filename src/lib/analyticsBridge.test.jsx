import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAnalyticsBridge, ANALYTICS_STORAGE_KEY } from './analyticsBridge';

describe('Analytics Event Bridge', () => {
  let cleanup;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Initialize the bridge
    cleanup = initAnalyticsBridge();
  });

  afterEach(() => {
    // Clean up event listeners
    if (cleanup) cleanup();
    vi.restoreAllMocks();
  });

  it('should capture auth login events and save to localStorage', () => {
    const testEmail = 'test@justiceai.law';

    // Dispatch auth event
    window.dispatchEvent(
      new CustomEvent('justice-ai-auth-login', {
        detail: { email: testEmail, type: 'signin' }
      })
    );

    // Verify localStorage
    const rawLogs = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    expect(rawLogs).toBeTruthy();

    const logs = JSON.parse(rawLogs);
    expect(logs.length).toBe(1);
    expect(logs[0].systemSource).toBe('Auth');
    expect(logs[0].type).toBe('auth_signin');
    expect(logs[0].userId).toBe(testEmail);
    expect(logs[0].data.email).toBe(testEmail);
  });

  it('should capture error events and save to localStorage', () => {
    const testError = 'TypeError: Cannot read properties of undefined';
    const testStack = '    at MyComponent (MyComponent.jsx:10:5)';

    // Dispatch error event
    window.dispatchEvent(
      new CustomEvent('justice-ai-error-caught', {
        detail: { error: testError, componentStack: testStack }
      })
    );

    // Verify localStorage
    const rawLogs = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    expect(rawLogs).toBeTruthy();

    const logs = JSON.parse(rawLogs);
    expect(logs.length).toBe(1);
    expect(logs[0].systemSource).toBe('ErrorBoundary');
    expect(logs[0].type).toBe('system_error');
    expect(logs[0].data.error).toBe(testError);
    expect(logs[0].data.componentStack).toContain(testStack);
    // Since no auth event occurred before, userId should be 'anonymous'
    expect(logs[0].userId).toBe('anonymous');
  });

  it('should correlate error events with the last logged in user', () => {
    const testEmail = 'user@justiceai.law';
    const testError = 'Network Error';

    // 1. User logs in
    window.dispatchEvent(
      new CustomEvent('justice-ai-auth-login', {
        detail: { email: testEmail, type: 'signin' }
      })
    );

    // 2. An error occurs later
    window.dispatchEvent(
      new CustomEvent('justice-ai-error-caught', {
        detail: { error: testError }
      })
    );

    const rawLogs = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const logs = JSON.parse(rawLogs);

    // Most recent log is first
    expect(logs.length).toBe(2);
    expect(logs[0].systemSource).toBe('ErrorBoundary');
    expect(logs[0].data.error).toBe(testError);

    // Correlation Pattern: The error should be linked to the logged-in user
    expect(logs[0].userId).toBe(testEmail);
  });
});
