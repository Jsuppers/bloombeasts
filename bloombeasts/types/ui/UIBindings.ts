/**
 * Binding type definitions
 *
 * Platform-agnostic reactive data binding interfaces.
 * Each platform provides its own implementation.
 */

/**
 * Read-only binding interface (for derived bindings)
 */
export interface ReadonlyBindingInterface<T> {
  get(): T;
  subscribe(callback: () => void): void;
}

/**
 * Binding interface - platform-agnostic reactive data binding
 * Each platform provides its own implementation
 */
export interface BindingInterface<T> {
  get(): T;
  set(value: T): void;
  subscribe(callback: () => void): void;
  derive<U>(fn: (value: T) => U): ReadonlyBindingInterface<U>;
}

/**
 * Binding constructor type
 */
export type BindingConstructor = {
  new <T>(value: T): BindingInterface<T>;
  derive<T extends any[], R>(
    bindings: any[],
    deriveFn: (...values: T) => R
  ): ReadonlyBindingInterface<R>;
};
