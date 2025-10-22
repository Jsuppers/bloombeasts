/**
 * Web Platform Adapter
 * Re-exports components from the custom web UI implementation
 * This adapter provides access to the canvas-based web UI components
 */

// Re-export core components from web UI implementation
export {
  // Core UI components
  UINode,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,

  // Data binding
  Binding,
  AnimatedBinding,
  DerivedBinding,
  AnimatedInterpolation,
  resolveBindable,

  // Animation system
  Animation,
  Easing,

  // Renderer (web-specific)
  UIRenderer,

  // Dialogs (web-specific)
  GenericDialog,
  RewardsDialog
} from '../../../deployments/web/src/ui';

// Re-export types from web UI implementation
export type {
  // Component props
  ViewProps,
  TextProps,
  ImageProps,
  ImageSource,
  PressableProps,
  ScrollViewProps,
  UIChildren,
  ConditionalProps,

  // Binding types
  Bindable,
  ValueBindingBase,

  // Animation types
  TimingAnimationConfig,

  // Style types
  ViewStyle,
  TextStyle,
  ImageStyle,
  LayoutStyle,
  BorderStyle,
  ShadowStyle,
  TransformStyle,
  ScrollViewStyle,
  FontFamily,
  DimensionValue,
  ColorValue,
  Callback,
  CallbackWithPayload,

  // Renderer types
  LayoutBox,

  // Dialog types
  DialogButton
} from '../../../deployments/web/src/ui';

// Import the DynamicList polyfill (will be created next)
export { DynamicList } from '../polyfills/DynamicList';

// Web platform doesn't have UIComponent, so we create a stub
export class UIComponent {
  constructor() {
    // Stub implementation for compatibility
    console.warn('[Web Adapter] UIComponent is a stub in web platform');
  }
}

// Web platform doesn't have AnimatedBinding as a separate export
// but it's included in the Binding module
export { AnimatedBinding as AnimatedBindingClass } from '../../../deployments/web/src/ui';

// Web platform doesn't have explicit Player type, use any for compatibility
export type Player = any;

/**
 * Platform-specific initialization for Web
 * Called when switching to Web platform
 */
export function initializePlatform(): void {
  console.log('[Web Adapter] Initialized');
  // Web-specific initialization can go here
  // For example, setting up canvas, event listeners, etc.
}

/**
 * Platform-specific cleanup for Web
 * Called when switching away from Web platform
 */
export function cleanupPlatform(): void {
  console.log('[Web Adapter] Cleanup');
  // Web-specific cleanup can go here
  // For example, removing event listeners, clearing canvas, etc.
}

/**
 * Web-specific utility to get current player
 * Returns null as web platform doesn't have native multiplayer
 */
export function getCurrentPlayer(): any {
  return null;
}

/**
 * Web platform doesn't support props system natively
 * This is a compatibility stub
 */
export interface HorizonPropsDefinition {
  [key: string]: {
    type: 'image' | 'string' | 'number' | 'boolean';
    default?: any;
  };
}

/**
 * Stub for props definition compatibility
 * Web platform doesn't use props system
 */
export function createPropsDefinition(props: HorizonPropsDefinition): HorizonPropsDefinition {
  console.warn('[Web Adapter] Props system is not supported in web platform');
  return props;
}

// Additional type mappings for compatibility with Horizon types
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type Position = 'relative' | 'absolute';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
export type Overflow = 'visible' | 'hidden' | 'scroll';
export type Display = 'flex' | 'none';
export type PointerEvents = 'auto' | 'none' | 'box-none' | 'box-only';