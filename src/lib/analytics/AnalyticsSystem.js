import { globalEventBus } from './EventBridge.js';

class AnalyticsSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Listen to user logins
    globalEventBus.on('user.login', (user) => {
      this.identify(user);
    });

    // Listen to system errors
    globalEventBus.on('system.error', (errorContext) => {
      this.trackError(errorContext);
    });
  }

  identify(user) {
    this.currentUser = user;
    console.log('[AnalyticsSystem] Identified user:', user);
    // In a real system, this would send data to an analytics provider
  }

  trackError(errorContext) {
    const enrichedError = {
      ...errorContext,
      userId: this.currentUser?.id || 'anonymous',
      userName: this.currentUser?.name || 'anonymous',
      userEmail: this.currentUser?.email || 'anonymous',
      timestamp: new Date().toISOString()
    };

    console.log('[AnalyticsSystem] Tracked enriched error:', enrichedError);
    // In a real system, this would send to Sentry/Datadog/etc.
  }
}

export const analyticsSystem = new AnalyticsSystem();
