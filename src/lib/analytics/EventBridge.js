class EventBridge {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      console.debug(`[EventBridge] Emitting ${event}`, payload);
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[EventBridge] Error in listener for ${event}:`, error);
        }
      });
    }
  }
}

export const globalEventBus = new EventBridge();
