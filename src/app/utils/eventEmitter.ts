type Listener<T = any> = (data: T) => void;

class EventEmitter {
  private events: { [key: string]: Listener[] } = {};

  on<T>(event: string, listener: Listener<T>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit<T>(event: string, data?: T) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data));
    }
  }

  off<T>(event: string, listener: Listener<T>) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    }
  }
}

export const eventEmitter = new EventEmitter();
