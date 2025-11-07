/**
 * Core UI type definitions
 *
 * Fundamental UI types for the platform-agnostic UI system.
 */

/**
 * Base UI element (platform-specific implementation)
 */
export type UIElement = any; // Platform-specific element type

/**
 * Conditional UI node (from UINode.if)
 */
export type ConditionalUINode = any; // Platform-specific conditional type

/**
 * UINode type - represents a UI node returned by UI components
 * Can be a single element, array of elements, null, or conditional rendering
 */
export type UINode = UIElement | UIElement[] | null | ConditionalUINode;
