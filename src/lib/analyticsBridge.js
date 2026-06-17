/**
 * 🧠 Synapse: Analytics Event Bridge
 *
 * Loosely couples the Auth system, Error Boundary, and other systems
 * to a centralized Analytics log via the DOM Event Bus (CustomEvents).
 *
 * Neither system imports the other. The bridge just listens and records.
 */

export const ANALYTICS_STORAGE_KEY = 'justice_ai_analytics';

function getLogs() {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_e) {
    return [];
  }
}

function saveLog(log) {
  try {
    const logs = getLogs();
    // Keep only last 1000 events to prevent quota issues
    const newLogs = [log, ...logs].slice(0, 1000);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(newLogs));

    // In dev, log that the bridge fired
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      console.log('🌉 [Event Bridge] Analytics captured:', log.type, log);
    }
  } catch (_e) {
    // Intentionally swallow errors - analytics should never crash the app
  }
}

function handleAuthEvent(event) {
  const { email, type = 'login' } = event.detail || {};
  saveLog({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    systemSource: 'Auth',
    type: `auth_${type}`,
    userId: email || 'anonymous',
    data: { email }
  });
}

function handleErrorEvent(event) {
  const { error, componentStack } = event.detail || {};

  // Try to find if a user is currently "active" in the analytics log
  // (a very loose form of correlation without direct Auth state access)
  const logs = getLogs();
  const lastAuthLog = logs.find(l => l.systemSource === 'Auth' && l.userId !== 'anonymous');
  const likelyUserId = lastAuthLog ? lastAuthLog.userId : 'anonymous';

  saveLog({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    systemSource: 'ErrorBoundary',
    type: 'system_error',
    userId: likelyUserId, // Correlation Pattern: linking error to last known user
    data: {
      error,
      componentStack: componentStack ? componentStack.substring(0, 200) + '...' : null
    }
  });
}

export function initAnalyticsBridge() {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('justice-ai-auth-login', handleAuthEvent);
  window.addEventListener('justice-ai-error-caught', handleErrorEvent);

  return () => {
    window.removeEventListener('justice-ai-auth-login', handleAuthEvent);
    window.removeEventListener('justice-ai-error-caught', handleErrorEvent);
  };
}
