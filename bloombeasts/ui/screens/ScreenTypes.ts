/**
 * Type definitions for screen components
 * Since Binding is a class that gets dynamically loaded based on platform,
 * we use 'any' for Binding instances in interfaces
 */

// Re-export actual Binding for use in implementations
export { Binding } from '../index';

// Type alias for Binding instances in interfaces
export type BindingInstance<T> = any;  // This will be a Binding<T> instance at runtime