import { globalEventBus } from './EventBridge.js';

export function initializeAnalytics() {
  const SESSION_LOG_KEY = 'justice_ai_analytics_logs';

  const appendLog = (logEntry) => {
    try {
      const existingLogs = JSON.parse(localStorage.getItem(SESSION_LOG_KEY) || '[]');
      existingLogs.push(logEntry);

      // Keep only last 100 events to prevent localStorage overflow
      if (existingLogs.length > 100) {
        existingLogs.shift();
      }

      localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(existingLogs));
    } catch (err) {
      console.warn('Analytics logging failed:', err);
    }
  };

  // Listen to UI Errors from ErrorBoundary
  globalEventBus.on('system.error', (data) => {
    appendLog({
      type: 'error',
      ...data
    });
    console.log('📊 [Analytics] Error logged with context:', data.context);
  });

  // Listen to Auth Events
  globalEventBus.on('user.login', (data) => {
    appendLog({
      type: 'login',
      ...data
    });
    console.log('📊 [Analytics] User login logged:', data.userId);
  });

  globalEventBus.on('user.signup', (data) => {
    appendLog({
      type: 'signup',
      ...data
    });
    console.log('📊 [Analytics] User signup logged:', data.userId);
  });
}
