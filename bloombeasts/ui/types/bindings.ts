/**
 * Binding Type Declarations
 *
 * These are type-only declarations for reactive data bindings.
 * Actual implementations are provided by the platform via UIMethodMappings.
 */

/**
 * Base class for value bindings
 */
export declare class ValueBindingBase<T> {
  protected _key: string;
  protected _isInitialized: boolean;
}

/**
 * Reactive data binding
 * Matches Horizon's Binding API (no get() or subscribe() methods)
 */
export declare class Binding<T = any> extends ValueBindingBase<T> {
  constructor(value: T);
  set(value: T | ((prev: T) => T)): void;
  derive<U>(fn: (value: T) => U): Binding<U>;
  static derive<T extends any[], R>(
    bindings: { [K in keyof T]: Binding<T[K]> },
    deriveFn: (...values: T) => R
  ): Binding<R>;
}

/**
 * Platform async methods interface
 * Provides setTimeout, setInterval, clearTimeout, clearInterval
 *
 * For web: Uses standard window.setTimeout, etc.
 * For Horizon: Uses component.async.setTimeout, etc.
 */
export interface AsyncMethods {
  /**
   * Sets a timer which executes a function once the timer expires
   */
  setTimeout: (callback: (...args: any[]) => void, timeout?: number) => number;

  /**
   * Cancels a timeout previously established by setTimeout
   */
  clearTimeout: (id: number) => void;

  /**
   * Repeatedly calls a function with a fixed time delay between calls
   */
  setInterval: (callback: (...args: any[]) => void, timeout?: number) => number;

  /**
   * Cancels a timed, repeating action established by setInterval
   */
  clearInterval: (id: number) => void;
}
