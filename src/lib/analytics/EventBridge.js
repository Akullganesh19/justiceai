class EventBridge {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    console.log(`[EventBridge] Fired: ${event}`, data);
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBridge] Error in listener for ${event}:`, err);
        }
      });
    }
  }
}

export const globalEventBus = new EventBridge();
