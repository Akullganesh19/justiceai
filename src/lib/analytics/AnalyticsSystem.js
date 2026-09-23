class AnalyticsSystem {
  constructor() {
    this.events = [];
    this.user = null;
  }

  identify(email, profile = {}) {
    this.user = { email, ...profile };
    this.track('user_identified', { email });
    console.log(`[Analytics] Identified user: ${email}`);
  }

  track(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      user: this.user ? this.user.email : 'anonymous'
    };
    this.events.push(event);
    console.log(`[Analytics] Tracked event: ${eventName}`, properties);
  }

  logError(error, componentStack) {
    this.track('system_error', { error, componentStack });
    console.error(`[Analytics] Logged error: ${error}`);
  }
}

export const analyticsSystem = new AnalyticsSystem();
