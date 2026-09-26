import { globalEventBus } from './EventBridge';

class AnalyticsSystem {
  constructor() {
    this.currentUser = null;
    this.setupListeners();
  }

  setupListeners() {
    globalEventBus.on('user.login', (data) => {
      console.log('[AnalyticsSystem] User identified:', data.email);
      this.currentUser = data.email;
    });

    globalEventBus.on('user.signup', (data) => {
      console.log('[AnalyticsSystem] New user signed up:', data.email);
      this.currentUser = data.email;
    });

    globalEventBus.on('system.error', (errorData) => {
      // Enrichment pattern: We know the error, now we add *who* experienced it
      const enrichedError = {
        ...errorData,
        affectedUser: this.currentUser || 'anonymous',
      };

      console.log('[AnalyticsSystem] Enriched error report:', enrichedError);
      // In a real app, this would send `enrichedError` to Datadog/Sentry/Mixpanel
    });
  }
}

// Initialize as a singleton
export const analyticsSystem = new AnalyticsSystem();
