/**
 * EventBridge: A loosely coupled pub/sub event bus
 * Allows isolated systems to communicate without direct dependencies.
 */
export class EventBridge {
  constructor() {
    this.listeners = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Function to execute when event is emitted
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  /**
   * Emit an event to all subscribers
   * @param {string} event - Event name
   * @param {any} data - Data payload to pass to subscribers
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(data);
        } catch (error) {
          console.error(`[EventBridge] Error in listener for event '${event}':`, error);
        }
      });
    }
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Specific callback to remove
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }
}

// Singleton instance for global app-wide communication
export const globalEventBus = new EventBridge();
