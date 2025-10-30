/**
 * Button Popup Component
 * Simple popup that shows buttons for user choices
 */

import { COLORS } from '../../styles/colors';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';

export interface ButtonPopupProps {
  title: string;
  message?: string;
  buttons: {
    text: string;
    onClick: () => void;
    color?: string;
  }[];
  useContainer?: boolean; // Use mission-container image as background
}

/**
 * Create a button popup
 */
export function createButtonPopup(ui: UIMethodMappings, props: ButtonPopupProps): any {
  const { View: V, Text: T, Pressable: P, Image, Binding } = ui;

  // Container dimensions when using mission-container image
  const containerWidth = 450;
  const containerHeight = 280;

  // If using container image, create a different structure
  if (props.useContainer) {
    const containerImageBinding = Binding.derive(
      [ui.assetsLoadedBinding],
      (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('mission-container') ?? null : null
    );

    return V({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      children: [
        // Content container with mission-container image
        V({
          style: {
            width: containerWidth,
            height: containerHeight,
            position: 'relative',
          },
          children: [
            // Mission container background image
            Image({
              source: containerImageBinding,
              style: {
                position: 'absolute',
                width: containerWidth,
                height: containerHeight,
                top: 0,
                left: 0,
              },
            }),

            // Content overlay
            V({
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32,
              },
              children: [
                // Title
                T({
                  text: props.title,
                  style: {
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: COLORS.textPrimary,
                    textAlign: 'center',
                    marginBottom: props.message ? 16 : 32,
                  },
                }),

                // Message (optional)
                props.message ? T({
                  text: props.message,
                  style: {
                    fontSize: 18,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                    marginBottom: 32,
                  },
                }) : null,

                // Buttons
                V({
                  style: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                  },
                  children: props.buttons.map((button, index) =>
                    P({
                      onClick: button.onClick,
                      style: {
                        backgroundColor: button.color || COLORS.primary,
                        padding: 14,
                        paddingLeft: 28,
                        paddingRight: 28,
                        borderRadius: 8,
                        minWidth: 120,
                        marginRight: index < props.buttons.length - 1 ? 16 : 0,
                      },
                      children: T({
                        text: button.text,
                        style: {
                          color: '#FFFFFF',
                          fontSize: 18,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        },
                      }),
                    })
                  ),
                }),
              ].filter(Boolean),
            }),
          ],
        }),
      ],
    });
  }

  // Default plain popup without container image
  return V({
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    children: [
      // Popup container
      V({
        style: {
          width: 400,
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 24,
          borderWidth: 2,
          borderColor: COLORS.primary,
        },
        children: [
          // Title
          T({
            text: props.title,
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              color: COLORS.textPrimary,
              textAlign: 'center',
              marginBottom: props.message ? 12 : 24,
            },
          }),

          // Message (optional)
          props.message ? T({
            text: props.message,
            style: {
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
            },
          }) : null,

          // Buttons
          V({
            style: {
              flexDirection: 'row',
              justifyContent: 'center',
            },
            children: props.buttons.map((button, index) =>
              P({
                onClick: button.onClick,
                style: {
                  backgroundColor: button.color || COLORS.primary,
                  padding: 12,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 8,
                  minWidth: 100,
                  marginRight: index < props.buttons.length - 1 ? 12 : 0,
                },
                children: T({
                  text: button.text,
                  style: {
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  },
                }),
              })
            ),
          }),
        ].filter(Boolean),
      }),
    ],
  });
}
