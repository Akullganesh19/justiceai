/**
 * EventBridge.js - Synapse Event Bridge Pattern
 * Connects decoupled systems (like Auth, ErrorBoundary, Logs, Activity) using a global event bus.
 */

class EventBridge {
  constructor() {
    this.listeners = {};
    this.context = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user: null
    };
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    const payload = {
      ...data,
      context: { ...this.context },
      timestamp: new Date().toISOString()
    };

    // Log the intelligence flow in development
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      console.log(`🧠 [Synapse Bridge] Event: ${event}`, payload);
    }

    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  // Update shared context (e.g., when a user logs in)
  setContext(key, value) {
    this.context[key] = value;
    this.emit('system.context_updated', { key });
  }

  getContext() {
    return { ...this.context };
  }
}

// Singleton instance
export const globalEventBus = new EventBridge();
