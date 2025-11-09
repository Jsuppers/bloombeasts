/**
 * UI component props definitions
 *
 * Platform-agnostic prop interfaces for all UI components.
 */

import type { UINode } from './UITypes';

/**
 * Style properties - platform-agnostic style definitions
 * These match Horizon's styling but work on web too
 */
export interface StyleProps {
  // Dimensions
  width?: number | string; // Support '100%', 'auto', etc.
  height?: number | string; // Support '100%', 'auto', etc.
  maxWidth?: number | string; // Max width constraint
  maxHeight?: number | string; // Max height constraint
  aspectRatio?: number; // Width/height ratio

  // Colors and visual
  backgroundColor?: string;
  color?: string; // Text/foreground color
  opacity?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;
  shadowColor?: string;
  shadowRadius?: number;

  // Spacing
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  // Layout
  display?: 'flex' | 'block' | 'inline' | 'none' | any; // Allow any for platform-specific values
  flex?: number; // Flex grow factor
  flexDirection?: 'row' | 'column';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number; // Gap between flex items
  overflow?: 'visible' | 'hidden';

  // Positioning
  position?: 'relative' | 'absolute';
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;

  // Typography (for convenience in style)
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | number;
  textAlign?: 'left' | 'center' | 'right'; // Text alignment
  textAlignVertical?: 'top' | 'center' | 'bottom'; // Vertical text alignment
  lineHeight?: number; // Line height for text
  textShadowColor?: string; // Text shadow color
  textShadowOffset?: { width: number; height: number }; // Text shadow offset
  textShadowRadius?: number; // Text shadow blur radius

  // Z-index for layering
  zIndex?: number;

  // Add more as needed
}

/**
 * Common props for all UI components
 */
export interface BaseUIProps {
  style?: StyleProps;
  children?: UINode | UINode[];
}

/**
 * View component props
 */
export interface ViewProps extends BaseUIProps {}

/**
 * Text component props
 */
export interface TextProps extends BaseUIProps {
  text?: string | any; // Support both string and bindings (ValueBindingBase, ReadonlyBindingInterface)
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  numberOfLines?: number; // Max number of lines before truncation
}

/**
 * Image component props
 */
export interface ImageProps extends BaseUIProps {
  imageId?: string | any; // Single image asset ID (or binding)
  source?: any; // Image source (platform-specific, can be URL, asset ID, or binding)
  binding?: any; // BaseBinding<string> for animations, derived values, etc.
  width?: number;
  height?: number;
}

/**
 * Pressable (button) component props
 */
export interface PressableProps extends BaseUIProps {
  onPress?: () => void;
  onClick?: () => void; // Alias for onPress (web compatibility)
  disabled?: boolean | any; // Whether the button is disabled (supports bindings)
  id?: string;
}

/**
 * ScrollView component props
 */
export interface ScrollViewProps extends BaseUIProps {
  horizontal?: boolean;
  showsScrollIndicator?: boolean;
}
