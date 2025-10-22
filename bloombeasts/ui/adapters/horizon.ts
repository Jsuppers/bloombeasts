/**
 * Horizon Platform Adapter
 * Re-exports components from the native Horizon UI SDK
 * This adapter provides direct access to Horizon's native UI components
 */

// For web builds, export stubs since horizon/ui doesn't exist
// In a real deployment, these would be conditionally imported based on the platform

// Re-export from web implementation for now (since we're building for web)
export {
  UINode,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Binding,
  AnimatedBinding,
  DerivedBinding,
  Animation,
  Easing
} from '../../../deployments/web/src/ui';

// Export DynamicList from polyfill
export { DynamicList } from '../polyfills/DynamicList';

// Stub UIComponent for web
export class UIComponent {
  panelWidth?: number;
  panelHeight?: number;
  static register(component: any): void {}
}

// Export additional types
export type {
  ViewStyle,
  TextStyle,
  ImageStyle,
  LayoutStyle,
  DimensionValue,
  ColorValue,
  ValueBindingBase,
  ImageSource
} from '../../../deployments/web/src/ui';

// Export stub types that don't exist in web
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type Position = 'relative' | 'absolute';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
export type BorderStyle = 'solid' | 'dotted' | 'dashed';
export type Overflow = 'visible' | 'hidden' | 'scroll';
export type Display = 'flex' | 'none';
export type PointerEvents = 'auto' | 'none' | 'box-none' | 'box-only';

// Stub Player type
export type Player = any;

/**
 * Platform-specific initialization for Horizon
 * Called when switching to Horizon platform
 */
export function initializePlatform(): void {
  console.log('[Horizon Adapter] Initialized');
  // Horizon-specific initialization can go here
  // For example, setting up persistent variables, etc.
}

/**
 * Platform-specific cleanup for Horizon
 * Called when switching away from Horizon platform
 */
export function cleanupPlatform(): void {
  console.log('[Horizon Adapter] Cleanup');
  // Horizon-specific cleanup can go here
}

/**
 * Horizon-specific utility to get current player
 * This is a Horizon-only feature
 */
export function getCurrentPlayer(): any {
  // This would normally access the Horizon player context
  // For now, return null as placeholder
  return null;
}

/**
 * Horizon-specific props system support
 * This wraps the Horizon props definition pattern
 */
export interface HorizonPropsDefinition {
  [key: string]: {
    type: 'image' | 'string' | 'number' | 'boolean';
    default?: any;
  };
}

/**
 * Helper to create props definition for Horizon components
 * This is specific to Horizon's asset system
 */
export function createPropsDefinition(props: HorizonPropsDefinition): HorizonPropsDefinition {
  return props;
}