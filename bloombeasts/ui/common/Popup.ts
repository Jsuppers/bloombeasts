/**
 * Common Popup Component
 * Reusable popup with title, description, content, and buttons
 */

import { COLORS } from '../styles/colors';
import { DIMENSIONS } from '../styles/dimensions';
import type { UIMethodMappings, ReadonlyBindingInterface } from '../../BloomBeastsGame';
import type { ValueBindingBase } from '../types/bindings';
import { UINodeType } from '../screens/ScreenUtils';
import { createButton, type ButtonColor, type ButtonType } from './Button';

export interface PopupButton {
  label: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
  onClick: () => void;
  color?: ButtonColor;
  type?: ButtonType;
  disabled?: boolean | ValueBindingBase<boolean> | ReadonlyBindingInterface<boolean>;
}

export interface PopupProps {
  ui: UIMethodMappings;
  title: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
  titleColor?: string; // Optional custom title color
  description?: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
  content?: UINodeType[];
  buttons?: PopupButton[];
  playSfx?: (sfxId: string) => void;
  width?: number;
  height?: number;
  onBackdropClick?: () => void;
}

/**
 * Create a common popup with mission-container background
 */
export function createPopup(props: PopupProps): UINodeType {
  const {
    ui,
    title,
    titleColor = COLORS.textPrimary,
    description,
    content = [],
    buttons = [],
    playSfx,
    width = 550,
    height = 400,
    onBackdropClick,
  } = props;

  // Calculate center position (assuming 1280x720 screen)
  const screenWidth = 1280;
  const screenHeight = 720;
  const centerX = (screenWidth - width) / 2;
  const centerY = (screenHeight - height) / 2;

  // Text component accepts string or binding directly
  const titleBinding = title;
  const descriptionBinding = description || null;

  // Calculate content area dimensions
  const contentPaddingTop = 80; // Space for title
  const contentPaddingBottom = buttons.length > 0 ? 80 : 20; // Space for buttons
  const contentHeight = height - contentPaddingTop - contentPaddingBottom;
  const contentPadding = 30;

  return ui.View({
    style: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 1000,
    },
    children: [
      // Semi-transparent backdrop
      onBackdropClick
        ? ui.Pressable({
            onClick: onBackdropClick,
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          })
        : ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }),

      // Content container with mission-container image (centered)
      ui.View({
        style: {
          position: 'absolute',
          left: centerX,
          top: centerY,
          width: width,
          height: height,
        },
        children: [
          // Mission container background image - assets preload automatically
          ui.Image({
            source: ui.assetIdToImageSource?.('mission-container') ?? null,
            style: {
              position: 'absolute',
              width: width,
              height: height,
              top: 0,
              left: 0,
            },
          }),

          // Title
          ui.View({
            style: {
              position: 'absolute',
              top: 20,
              left: contentPadding,
              width: width - contentPadding * 2,
            },
            children: ui.Text({
              text: titleBinding,
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                fontWeight: 'bold',
                color: titleColor,
                textAlign: 'center',
              },
            }),
          }),

          // Description (optional)
          descriptionBinding
            ? ui.View({
                style: {
                  position: 'absolute',
                  top: 60,
                  left: contentPadding,
                  width: width - contentPadding * 2,
                },
                children: ui.Text({
                  text: descriptionBinding,
                  style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                  },
                }),
              })
            : null,

          // Content area (scrollable if needed)
          content.length > 0
            ? ui.View({
                style: {
                  position: 'absolute',
                  top: description ? 100 : contentPaddingTop,
                  left: contentPadding,
                  width: width - contentPadding * 2,
                  height: description
                    ? contentHeight - 40
                    : contentHeight,
                  flexDirection: 'column',
                  gap: DIMENSIONS.spacing.sm,
                },
                children: content,
              })
            : null,

          // Buttons row at bottom
          buttons.length > 0
            ? ui.View({
                style: {
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  width: width,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: DIMENSIONS.spacing.md,
                },
                children: buttons.map((button) =>
                  createButton({
                    ui,
                    label: button.label,
                    onClick: button.onClick,
                    color: button.color,
                    type: button.type,
                    disabled: button.disabled,
                    playSfx,
                  })
                ),
              })
            : null,
        ].filter(Boolean),
      }),
    ],
  });
}
