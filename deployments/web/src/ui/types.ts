/**
 * UI Types
 * Mimics Horizon's Custom UI type system
 */

import { Bindable } from './Binding';

export type DimensionValue = number | string;
export type ColorValue = string;

/**
 * Callback types
 */
export type Callback = (relativeX?: number, relativeY?: number) => void;
export type CallbackWithPayload = (payload: string) => void;

/**
 * Layout Style - Flexbox and positioning
 */
export type LayoutStyle = {
    display?: Bindable<'none' | 'flex'>;
    width?: Bindable<DimensionValue>;
    height?: Bindable<DimensionValue>;
    bottom?: Bindable<DimensionValue>;
    left?: Bindable<DimensionValue>;
    right?: Bindable<DimensionValue>;
    top?: Bindable<DimensionValue>;
    minWidth?: DimensionValue;
    maxWidth?: DimensionValue;
    minHeight?: DimensionValue;
    maxHeight?: DimensionValue;

    margin?: DimensionValue;
    marginBottom?: DimensionValue;
    marginHorizontal?: DimensionValue;
    marginLeft?: DimensionValue;
    marginRight?: DimensionValue;
    marginTop?: DimensionValue;
    marginVertical?: DimensionValue;

    padding?: DimensionValue;
    paddingBottom?: DimensionValue;
    paddingHorizontal?: DimensionValue;
    paddingLeft?: DimensionValue;
    paddingRight?: DimensionValue;
    paddingTop?: DimensionValue;
    paddingVertical?: DimensionValue;

    position?: 'absolute' | 'relative';
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    overflow?: 'visible' | 'hidden';

    flex?: number;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: DimensionValue;
    aspectRatio?: number;
    zIndex?: number;

    layoutOrigin?: [number, number];
    direction?: 'inherit' | 'ltr' | 'rtl';
};

/**
 * Border Style
 */
export type BorderStyle = {
    borderColor?: Bindable<ColorValue>;
    borderRadius?: Bindable<number>;
    borderBottomLeftRadius?: Bindable<number>;
    borderBottomRightRadius?: Bindable<number>;
    borderTopLeftRadius?: Bindable<number>;
    borderTopRightRadius?: Bindable<number>;
    borderWidth?: Bindable<number>;
    borderBottomWidth?: Bindable<number>;
    borderLeftWidth?: Bindable<number>;
    borderRightWidth?: Bindable<number>;
    borderTopWidth?: Bindable<number>;
};

/**
 * Shadow Style
 */
export type ShadowStyle = {
    shadowColor?: Bindable<ColorValue>;
    shadowFalloff?: 'linear' | 'sqrt' | 'sigmoid';
    shadowOffset?: [number, number];
    shadowOpacity?: Bindable<number>;
    shadowRadius?: number;
    shadowSpreadRadius?: number;
};

/**
 * Transform Style
 */
export type TransformStyle = {
    transform?: Array<
        | { rotate: Bindable<string> }
        | { scale: Bindable<number> }
        | { scaleX: Bindable<number> }
        | { scaleY: Bindable<number> }
        | { translate: [Bindable<number>, Bindable<number>] }
        | { translateX: Bindable<number> }
        | { translateY: Bindable<number> }
        | { skewX: Bindable<string> }
        | { skewY: Bindable<string> }
    >;
    transformOrigin?: [DimensionValue, DimensionValue];
};

/**
 * View Style - combines all layout and visual styles
 */
export type ViewStyle = LayoutStyle & BorderStyle & ShadowStyle & TransformStyle & {
    backgroundColor?: Bindable<ColorValue>;
    backgroundClip?: 'border-box' | 'padding-box';
    opacity?: Bindable<number>;

    // Gradient support
    gradientColorA?: Bindable<ColorValue>;
    gradientColorB?: Bindable<ColorValue>;
    gradientXa?: number | string;
    gradientYa?: number | string;
    gradientXb?: number | string;
    gradientYb?: number | string;
    gradientAngle?: string;
};

/**
 * Font families
 */
export type FontFamily = 'Anton' | 'Bangers' | 'Kallisto' | 'Optimistic' | 'Oswald' | 'Roboto' | 'Roboto-Mono' | 'Arial' | 'sans-serif';

/**
 * Text Style - extends View Style with text-specific properties
 */
export type TextStyle = ViewStyle & {
    color?: Bindable<ColorValue>;
    fontFamily?: FontFamily;
    fontSize?: Bindable<number>;
    fontWeight?: Bindable<'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'>;
    letterSpacing?: number;
    lineHeight?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center';
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    textDecorationLine?: Bindable<'none' | 'underline' | 'line-through' | 'underline line-through'>;
    textShadowColor?: Bindable<ColorValue>;
    textShadowOffset?: [number, number];
    textShadowRadius?: number;
    whiteSpace?: 'normal' | 'pre-line' | 'pre-wrap';
};

/**
 * Image Style - extends View Style with image-specific properties
 */
export type ImageStyle = ViewStyle & {
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
    tintColor?: Bindable<ColorValue>;
    tintOperation?: 'replace' | 'multiply';
};

/**
 * ScrollView Style
 */
export type ScrollViewStyle = ViewStyle;
