import { globalEventBus } from './EventBridge.js';

class AnalyticsSystem {
  constructor() {
    this.currentUser = null;
    this.setupListeners();
  }

  setupListeners() {
    globalEventBus.on('user.login', (user) => {
      this.identify(user.email);
    });

    globalEventBus.on('system.error', (errorContext) => {
      this.trackError(errorContext);
    });
  }

  identify(email) {
    this.currentUser = email;
    console.log(`[Analytics] Identified user: ${email}`);
  }

  trackError(errorContext) {
    const report = {
      ...errorContext,
      affectedUser: this.currentUser || 'anonymous',
      timestamp: new Date().toISOString()
    };
    console.log('[Analytics] System Error Recorded:', report);
  }
}

export const analyticsSystem = new AnalyticsSystem();
