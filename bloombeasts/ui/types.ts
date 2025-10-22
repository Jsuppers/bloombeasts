/**
 * Unified Type Definitions for BloomBeasts UI
 * Platform-agnostic types that work across both Horizon and Web platforms
 */

/**
 * Base style properties shared across all components
 */
export interface BaseStyle {
  // Layout
  width?: DimensionValue;
  height?: DimensionValue;
  minWidth?: DimensionValue;
  minHeight?: DimensionValue;
  maxWidth?: DimensionValue;
  maxHeight?: DimensionValue;

  // Flexbox
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: DimensionValue;
  flexDirection?: FlexDirection;
  flexWrap?: FlexWrap;
  alignItems?: FlexAlign;
  alignSelf?: FlexAlign;
  alignContent?: FlexAlign;
  justifyContent?: FlexJustify;

  // Spacing
  margin?: DimensionValue;
  marginTop?: DimensionValue;
  marginRight?: DimensionValue;
  marginBottom?: DimensionValue;
  marginLeft?: DimensionValue;
  marginHorizontal?: DimensionValue;
  marginVertical?: DimensionValue;

  padding?: DimensionValue;
  paddingTop?: DimensionValue;
  paddingRight?: DimensionValue;
  paddingBottom?: DimensionValue;
  paddingLeft?: DimensionValue;
  paddingHorizontal?: DimensionValue;
  paddingVertical?: DimensionValue;

  // Position
  position?: Position;
  top?: DimensionValue;
  right?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  zIndex?: number;

  // Display
  display?: Display;
  opacity?: number;
  overflow?: Overflow;
  pointerEvents?: PointerEvents;

  // Transform
  transform?: Transform[];
  transformOrigin?: string;

  // Other
  backgroundColor?: ColorValue;
  aspectRatio?: number;
  gap?: DimensionValue;
  rowGap?: DimensionValue;
  columnGap?: DimensionValue;
}

/**
 * Border style properties
 */
export interface BorderStyle {
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor?: ColorValue;
  borderTopColor?: ColorValue;
  borderRightColor?: ColorValue;
  borderBottomColor?: ColorValue;
  borderLeftColor?: ColorValue;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
}

/**
 * Shadow style properties
 */
export interface ShadowStyle {
  shadowColor?: ColorValue;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number; // Android-specific shadow
  boxShadow?: string; // Web-specific shadow
}

/**
 * Layout style combining base, border, and shadow
 */
export interface LayoutStyle extends BaseStyle, BorderStyle, ShadowStyle {}

/**
 * Text-specific style properties
 */
export interface TextStyle extends LayoutStyle {
  color?: ColorValue;
  fontFamily?: FontFamily;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: FontWeight;
  fontVariant?: string[];
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: TextAlign;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textDecorationColor?: ColorValue;
  textShadowColor?: ColorValue;
  textShadowOffset?: { width: number; height: number };
  textShadowRadius?: number;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  includeFontPadding?: boolean;
  writingDirection?: 'auto' | 'ltr' | 'rtl';
}

/**
 * Image-specific style properties
 */
export interface ImageStyle extends LayoutStyle {
  resizeMode?: ImageResizeMode;
  tintColor?: ColorValue;
  overlayColor?: ColorValue;
}

/**
 * View style (combination of all layout styles)
 */
export interface ViewStyle extends LayoutStyle {}

/**
 * ScrollView-specific style properties
 */
export interface ScrollViewStyle extends ViewStyle {
  contentContainerStyle?: ViewStyle;
}

/**
 * Transform types
 */
export type Transform =
  | { perspective: number }
  | { rotate: string }
  | { rotateX: string }
  | { rotateY: string }
  | { rotateZ: string }
  | { scale: number }
  | { scaleX: number }
  | { scaleY: number }
  | { translateX: DimensionValue }
  | { translateY: DimensionValue }
  | { skewX: string }
  | { skewY: string }
  | { matrix: number[] };

/**
 * Dimension value types
 */
export type DimensionValue = number | string | 'auto';

/**
 * Color value types
 */
export type ColorValue = string;

/**
 * Font family types
 */
export type FontFamily = string;

/**
 * Flex types
 */
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Position types
 */
export type Position = 'relative' | 'absolute';

/**
 * Text alignment types
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Font weight types
 */
export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

/**
 * Image resize mode types
 */
export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';

/**
 * Overflow types
 */
export type Overflow = 'visible' | 'hidden' | 'scroll';

/**
 * Display types
 */
export type Display = 'flex' | 'none';

/**
 * Pointer events types
 */
export type PointerEvents = 'auto' | 'none' | 'box-none' | 'box-only';

/**
 * Image source type
 */
export interface ImageSource {
  uri?: string;
  width?: number;
  height?: number;
  scale?: number;
  method?: 'GET' | 'POST';
  headers?: { [key: string]: string };
  body?: string;
}

/**
 * Event callback types
 */
export type Callback = () => void;
export type CallbackWithPayload<T = any> = (payload: T) => void;

/**
 * Player type (platform-specific, but needed for compatibility)
 */
export type Player = any;

/**
 * UI Children type
 */
export type UIChildren = any;

/**
 * Bindable value type
 */
export type Bindable<T> = T | { value: T; subscribe?: (callback: (value: T) => void) => void };

/**
 * Base binding interface
 */
export interface ValueBindingBase<T> {
  value: T;
  subscribe(callback: (value: T) => void): () => void;
  set(value: T): void;
}

/**
 * Component prop types
 */
export interface ViewProps {
  style?: ViewStyle;
  children?: UIChildren;
  id?: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
}

export interface TextProps {
  content?: Bindable<string>;
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
  id?: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
}

export interface ImageProps {
  source?: ImageSource | string;
  style?: ImageStyle;
  defaultSource?: ImageSource | string;
  loadingIndicatorSource?: ImageSource | string;
  progressiveRenderingEnabled?: boolean;
  fadeDuration?: number;
  resizeMethod?: 'auto' | 'resize' | 'scale';
  id?: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
}

export interface PressableProps {
  onPress?: Callback | CallbackWithPayload<Player>;
  onPressIn?: Callback;
  onPressOut?: Callback;
  onLongPress?: Callback;
  disabled?: boolean;
  hitSlop?: number | { top?: number; left?: number; bottom?: number; right?: number };
  pressRetentionOffset?: { top?: number; left?: number; bottom?: number; right?: number };
  delayLongPress?: number;
  style?: ViewStyle | ((pressed: boolean) => ViewStyle);
  children?: UIChildren;
  id?: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
}

export interface ScrollViewProps {
  style?: ScrollViewStyle;
  contentContainerStyle?: ViewStyle;
  children?: UIChildren;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  scrollEnabled?: boolean;
  pagingEnabled?: boolean;
  scrollEventThrottle?: number;
  decelerationRate?: 'fast' | 'normal' | number;
  snapToInterval?: number;
  snapToAlignment?: 'start' | 'center' | 'end';
  snapToOffsets?: number[];
  contentInset?: { top?: number; left?: number; bottom?: number; right?: number };
  contentInsetAdjustmentBehavior?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
  contentOffset?: { x: number; y: number };
  onScroll?: CallbackWithPayload<any>;
  onScrollBeginDrag?: Callback;
  onScrollEndDrag?: Callback;
  onMomentumScrollBegin?: Callback;
  onMomentumScrollEnd?: Callback;
  onContentSizeChange?: CallbackWithPayload<{ width: number; height: number }>;
  id?: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
}

/**
 * Animation configuration types
 */
export interface TimingAnimationConfig {
  duration?: number;
  easing?: (value: number) => number;
  delay?: number;
  isInteraction?: boolean;
  useNativeDriver?: boolean;
}

export interface SpringAnimationConfig {
  toValue?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number | { x: number; y: number };
  bounciness?: number;
  speed?: number;
  tension?: number;
  friction?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  delay?: number;
  isInteraction?: boolean;
  useNativeDriver?: boolean;
}

export interface DecayAnimationConfig {
  velocity: number | { x: number; y: number };
  deceleration?: number;
  isInteraction?: boolean;
  useNativeDriver?: boolean;
}

/**
 * Dialog types
 */
export interface DialogButton {
  text: string;
  onPress?: Callback;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Layout box type for renderer
 */
export interface LayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Conditional rendering props
 */
export interface ConditionalProps {
  condition: Bindable<boolean>;
  children: UIChildren;
  fallback?: UIChildren;
}

/**
 * DynamicList props (unified across platforms)
 */
export interface DynamicListProps<T = any> {
  data: Bindable<T[]>;
  renderItem: (item: T, index?: number) => any;
  style?: ViewStyle;
  keyExtractor?: (item: T, index: number) => string | number;
  onUpdate?: Callback;
}

/**
 * Platform-agnostic UI node interface
 */
export interface UINodeInterface<T = any> {
  type: string;
  props?: T;
  children?: UIChildren;
  key?: string | number;
}

/**
 * Export a unified component props type
 */
export type ComponentProps =
  | ViewProps
  | TextProps
  | ImageProps
  | PressableProps
  | ScrollViewProps
  | DynamicListProps;