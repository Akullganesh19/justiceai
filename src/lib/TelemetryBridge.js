/**
 * 🧠 Synapse Connection: Auth ↔ Errors/Telemetry
 *
 * Enrichment Pattern:
 * This bridge connects the ErrorBoundary (System A) with Auth (System B) without
 * directly coupling them. It listens for telemetry events, enriches them with the
 * authenticated user's context from localStorage, and stores the enriched telemetry.
 */

export function initTelemetryBridge() {
  if (typeof window === 'undefined') return;

  const handleTelemetryError = (event) => {
    try {
      const errorDetail = event.detail;

      // Read user context from System B (Auth)
      const authDataString = localStorage.getItem('justice_auth_user');
      let affectedUser = 'anonymous_user';

      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          affectedUser = authData.email || 'anonymous_user';
        } catch (e) {
          // Ignore parsing errors for auth data
        }
      }

      // Enrich the error with user context
      const enrichedTelemetry = {
        ...errorDetail,
        affectedUser,
        enrichedAt: new Date().toISOString()
      };

      // Store the enriched telemetry
      const analyticsString = localStorage.getItem('justice_ai_analytics');
      let analytics = [];

      if (analyticsString) {
        try {
          analytics = JSON.parse(analyticsString);
        } catch (e) {
          // Ignore parsing errors
        }
      }

      analytics.push({ type: 'error', data: enrichedTelemetry });

      // Keep only the last 100 events to prevent local storage quota issues
      if (analytics.length > 100) {
        analytics = analytics.slice(analytics.length - 100);
      }

      localStorage.setItem('justice_ai_analytics', JSON.stringify(analytics));

      console.log('🧠 Synapse: Error enriched with user context', {
        affectedUser,
        error: errorDetail.error
      });

    } catch (e) {
      console.error('Failed to process telemetry bridge event:', e);
    }
  };

  window.addEventListener('justice-telemetry-error', handleTelemetryError);

  // Return a cleanup function
  return () => {
    window.removeEventListener('justice-telemetry-error', handleTelemetryError);
  };
}
