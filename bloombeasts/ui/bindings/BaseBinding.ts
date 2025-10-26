/**
 * Base Binding Class
 * Platform-agnostic reactive value container
 */

export class BaseBinding<T> {
  protected value: T;
  protected listeners: Set<() => void> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  /**
   * Get the current value
   */
  get(): T {
    return this.value;
  }

  /**
   * Set a new value
   */
  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notifyListeners();
    }
  }

  /**
   * Create a derived binding from this one
   */
  derive<R>(fn: (val: T) => R): BaseBinding<R> {
    const derived = new BaseBinding(fn(this.value));

    // Update derived when source changes
    this.addListener(() => {
      derived.set(fn(this.get()));
    });

    return derived;
  }

  /**
   * Add a listener that fires when value changes
   */
  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove a listener
   */
  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of a change
   */
  protected notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Clean up resources (override in subclasses)
   * Clears all listeners to prevent memory leaks
   */
  dispose(): void {
    this.listeners.clear();
  }

  /**
   * Get the number of active listeners (for debugging)
   */
  getListenerCount(): number {
    return this.listeners.size;
  }
}
