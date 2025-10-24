/**
 * Button Popup Component
 * Simple popup that shows buttons for user choices
 */

import { View, Text, Pressable } from '../../index';
import { COLORS } from '../../styles/colors';

export interface ButtonPopupProps {
  title: string;
  message?: string;
  buttons: {
    text: string;
    onClick: () => void;
    color?: string;
  }[];
}

/**
 * Create a button popup
 */
export function createButtonPopup(props: ButtonPopupProps): any {
  const { View: V, Text: T, Pressable: P } = { View, Text, Pressable };

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
