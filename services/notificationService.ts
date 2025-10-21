type Listener = (data: any) => void;

interface Listeners {
  [key: string]: Listener[];
}

class NotificationService {
  private listeners: Listeners = {};

  subscribe(event: string, callback: Listener): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return an unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(l => l !== callback);
    };
  }

  dispatch(event: string, data: any): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(listener => listener(data));
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
