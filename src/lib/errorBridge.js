/**
 * errorBridge.js - Synapse connection layer
 * Connects the global Error Monitoring system (window errors/promise rejections)
 * to the User Notification system (Toast) via loose event coupling.
 */

export function initErrorBridge() {
  if (typeof window === 'undefined') return;

  const dispatchToast = (title, message) => {
    window.dispatchEvent(
      new CustomEvent('justice-ai-toast', {
        detail: {
          type: 'error',
          title: title,
          message: message,
          duration: 6000,
        },
      })
    );
  };

  // Listen for unhandled promise rejections (often network/fetch failures)
  window.addEventListener('unhandledrejection', (event) => {
    // Avoid double-logging or interfering with existing handlers
    // We just surface the insight to the user
    const errorMsg = event.reason?.message || event.reason || 'An unexpected network error occurred';

    // Ignore aborted requests as they are usually intentional
    if (errorMsg === 'The user aborted a request.' || event.reason?.name === 'AbortError') {
      return;
    }

    dispatchToast('Background Process Failed', String(errorMsg));
  });

  // Listen for unhandled synchronous errors
  window.addEventListener('error', (event) => {
    // Don't surface internal React errors that ErrorBoundary will catch anyway,
    // focus on uncaught script errors
    dispatchToast('System Error Detected', event.message || 'An unexpected script error occurred');
  });
}
