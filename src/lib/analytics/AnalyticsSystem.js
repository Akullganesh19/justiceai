import { globalEventBus } from './EventBridge.js';

class AnalyticsSystem {
  constructor() {
    this.user = null;
    this.events = [];

    // Subscribe to Auth System events via EventBridge
    globalEventBus.on('user.login', this.handleUserLogin.bind(this));
    globalEventBus.on('user.signup', this.handleUserSignup.bind(this));
    globalEventBus.on('user.logout', this.handleUserLogout.bind(this));
    globalEventBus.on('system.error', this.handleSystemError.bind(this));
  }

  handleUserLogin(user) {
    console.log('[AnalyticsSystem] Identifying user:', user);
    this.user = user;
    this.track('login');
  }

  handleUserSignup(user) {
    console.log('[AnalyticsSystem] New user signup:', user);
    this.user = user;
    this.track('signup');
  }

  handleUserLogout() {
    console.log('[AnalyticsSystem] User logged out');
    this.track('logout');
    this.user = null;
  }

  handleSystemError(errorContext) {
    console.log('[AnalyticsSystem] Tracking system error:', errorContext);
    this.track('error', errorContext);
  }

  track(eventName, payload = {}) {
    const event = {
      event: eventName,
      userId: this.user ? this.user.email : 'anonymous',
      timestamp: new Date().toISOString(),
      payload
    };
    this.events.push(event);
    console.log(`[AnalyticsSystem] Tracked: ${eventName}`, event);

    // In a real app, you would batch and send these to a backend
  }
}

export const analytics = new AnalyticsSystem();
