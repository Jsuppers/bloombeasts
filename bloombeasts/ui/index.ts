/**
 * BloomBeasts UI System
 * Re-exports UI components from the web implementation
 *
 * Note: For Horizon builds, the Horizon platform will provide its own
 * UI components via platformConfig.getUIMethodMappings() which uses horizon/ui
 */

// Re-export all UI components and types from web implementation
export {
  // Core components
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

  // Animation
  Animation,
  Easing,

  // Renderer
  UIRenderer,

  // Dialogs
  GenericDialog,
  RewardsDialog
} from '../../deployments/web/src/ui';

// Re-export types
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
} from '../../deployments/web/src/ui';
