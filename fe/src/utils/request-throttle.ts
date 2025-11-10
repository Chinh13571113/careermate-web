// Utility to prevent multiple simultaneous calls
export class RequestThrottle {
  private static instances = new Map<string, Promise<any>>();
  
  static async throttle<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // If request with this key is already in progress, return existing promise
    if (this.instances.has(key)) {
      return this.instances.get(key);
    }
    
    // Start new request
    const promise = fn().finally(() => {
      // Clean up after request completes
      this.instances.delete(key);
    });
    
    this.instances.set(key, promise);
    return promise;
  }
  
  static isInProgress(key: string): boolean {
    return this.instances.has(key);
  }
  
  static clear(key?: string) {
    if (key) {
      this.instances.delete(key);
    } else {
      this.instances.clear();
    }
  }
}