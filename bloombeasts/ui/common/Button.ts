/**
 * Common Button Component
 * Reusable button with hover effects and sound
 */

import { COLORS } from '../styles/colors';
import { DIMENSIONS } from '../styles/dimensions';
import { sideMenuButtonDimensions, longButtonDimensions } from '../constants/dimensions';
import type { UIMethodMappings, ReadonlyBindingInterface } from '../../BloomBeastsGame';
import type { ValueBindingBase } from '../types/bindings';
import { UINodeType } from '../screens/ScreenUtils';

export type ButtonType = 'default' | 'short' | 'long';
export type ButtonColor = 'default' | 'red' | 'green';

export interface ButtonProps {
  ui: UIMethodMappings;
  label: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
  onClick: () => void;
  type?: ButtonType;

  // Simple usage: just pass color string (static)
  color?: ButtonColor;
  disabled?: boolean | ValueBindingBase<boolean> | ReadonlyBindingInterface<boolean>;

  // Advanced usage: pass complete bindings that return final computed values
  // Use these when you need reactive bindings (avoids .derive() on derived bindings)
  imageSource?: any; // Binding or static image source for button background
  opacity?: any; // Binding or static opacity value (0-1)
  textColor?: any; // Binding or static text color string

  playSfx?: (sfxId: string) => void;
  style?: any; // Additional style overrides
}

/**
 * Get button dimensions based on type
 */
function getButtonDimensions(type: ButtonType): { width: number; height: number } {
  switch (type) {
    case 'short':
      return { width: 80, height: 36 };
    case 'long':
      return longButtonDimensions;
    case 'default':
    default:
      return sideMenuButtonDimensions;
  }
}

/**
 * Get button asset ID based on color and type
 */
function getButtonAssetId(color: ButtonColor, type: ButtonType): string {
  // Long buttons have their own green variant
  if (type === 'long' && color === 'green') {
    return 'long-green-button';
  }

  // Standard color mapping
  switch (color) {
    case 'red':
      return 'red-button';
    case 'green':
      return 'green-button';
    case 'default':
    default:
      return 'standard-button';
  }
}

/**
 * Create a common button with hover effects and sound
 *
 * Two usage patterns:
 * 1. Simple: Pass static `color` and `disabled` props (for static buttons)
 * 2. Advanced: Pass complete `imageSource`, `opacity`, `textColor` bindings
 *    (for reactive buttons - avoids calling .derive() on derived bindings)
 */
export function createButton(props: ButtonProps): UINodeType {
  const {
    ui,
    label,
    onClick,
    type = 'default',
    color = 'default',
    disabled = false,
    imageSource: customImageSource,
    opacity: customOpacity,
    textColor: customTextColor,
    playSfx,
    style = {},
  } = props;

  const dimensions = getButtonDimensions(type);

  // Use custom bindings if provided, otherwise compute from color/disabled
  const imageSource = customImageSource ?? (ui.assetIdToImageSource?.(getButtonAssetId(color, type)) || null);

  // For opacity and textColor:
  // - If custom values provided, use them (supports reactive bindings)
  // - If disabled is a static boolean, use it to determine appearance
  // - If disabled is a binding, use enabled appearance by default
  //   (caller should provide customOpacity/customTextColor for reactive appearance)
  const opacity = customOpacity ?? (
    (typeof disabled === 'boolean' && disabled) ? 0.5 : 1.0
  );
  const textColor = customTextColor ?? (
    (typeof disabled === 'boolean' && disabled) ? '#888' : COLORS.textPrimary
  );

  return ui.Pressable({
    onClick: () => {
      if (playSfx) {
        playSfx('sfx-menu-button-select');
      }
      onClick();
    },
    disabled: disabled,
    style: {
      width: dimensions.width,
      height: dimensions.height,
      ...style,
    },
    children: [
      // Button background image
      ui.Image({
        source: imageSource,
        style: {
          position: 'absolute',
          width: dimensions.width,
          height: dimensions.height,
          opacity: opacity,
        },
      }),
      // Button text centered
      ui.View({
        style: {
          position: 'absolute',
          width: dimensions.width,
          height: dimensions.height,
          justifyContent: 'center',
          alignItems: 'center',
        },
        children: ui.Text({
          text: label,
          style: {
            fontSize: style.fontSize ?? DIMENSIONS.fontSize.md,
            color: textColor,
            textAlign: style.textAlign ?? 'center',
            fontWeight: style.fontWeight ?? 'bold',
            textAlignVertical: 'center',
            marginTop: style.paddingTop ?? 0,
          },
        }),
      }),
    ],
  });
}
