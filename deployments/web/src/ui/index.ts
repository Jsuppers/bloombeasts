/**
 * UI System
 * Horizon-like component system for web deployment
 */

// Export bindings
export { Binding, AnimatedBinding, DerivedBinding, AnimatedInterpolation, resolveBindable } from './Binding';
export type { Bindable, ValueBindingBase } from './Binding';

// Export animations
export { Animation, Easing } from './Animation';
export type { TimingAnimationConfig } from './Animation';

// Export components
export { UINode, View, Text, Image, Pressable, ScrollView } from './components';
export type {
    ViewProps,
    TextProps,
    ImageProps,
    ImageSource,
    PressableProps,
    ScrollViewProps,
    UIChildren,
    ConditionalProps
} from './components';

// Export types
export type {
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
} from './types';

// Export renderer
export { UIRenderer } from './UIRenderer';
export type { LayoutBox } from './UIRenderer';

// Export dialogs
export { GenericDialog, RewardsDialog } from './Dialog';
export type { DialogButton } from './Dialog';
