/**
 * Card Detail Popup Component
 * Shows card details in a popup overlay with action buttons
 */

import { View, Text, Image, Pressable, Binding } from '../../index';
import { COLORS } from '../../styles/colors';
import { DIMENSIONS, GAPS } from '../../styles/dimensions';
import { sideMenuButtonDimensions } from '../../constants/dimensions';
import type { CardDetailDisplay, MenuStats } from '../../../../bloombeasts/gameManager';
import { UINodeType } from '../ScreenUtils';
import { createCardComponent } from './CardRenderer';

export interface CardDetailPopupProps {
  cardDetail: CardDetailDisplay;
  onButtonClick: (buttonId: string) => void;
}

/**
 * Create a card detail popup overlay
 */
export function createCardDetailPopup(props: CardDetailPopupProps): UINodeType {
  const { cardDetail, onButtonClick } = props;

  const cardWidth = 210; // Standard card width
  const cardHeight = 280; // Standard card height
  const buttonWidth = sideMenuButtonDimensions.width;
  const buttonHeight = sideMenuButtonDimensions.height;
  const buttonSpacing = GAPS.buttons;

  // Calculate center position (screen is 1280x720)
  const screenWidth = 1280;
  const screenHeight = 720;
  const totalWidth = cardWidth + DIMENSIONS.spacing.xl + buttonWidth;
  const contentX = (screenWidth - totalWidth) / 2;
  const contentY = (screenHeight - cardHeight) / 2;

  return View({
    style: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    children: [
      // Black backdrop - clicking closes the popup
      Pressable({
        onClick: () => onButtonClick('btn-card-close'),
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }),

      // Content container (centered)
      View({
        style: {
          position: 'absolute',
          left: contentX,
          top: contentY,
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
        children: [
          // Card display
          createCardComponent({
            card: cardDetail.card,
            isInDeck: cardDetail.isInDeck,
            showDeckIndicator: false, // Don't show deck indicator in detail view
          }),

          // Buttons to the right
          View({
            style: {
              marginLeft: DIMENSIONS.spacing.xl,
              flexDirection: 'column',
            },
            children: (cardDetail.buttons || []).filter(b => b).map((buttonText, index) =>
              Pressable({
                onClick: () => {
                  // Prevent backdrop click
                  const buttonId = `btn-card-${buttonText.toLowerCase().replace(/ /g, '-')}`;
                  onButtonClick(buttonId);
                },
                style: {
                  width: buttonWidth,
                  height: buttonHeight,
                  position: 'relative',
                  marginBottom: index < cardDetail.buttons.length - 1 ? buttonSpacing : 0,
                },
                children: [
                  // Button background image
                  Image({
                    source: new Binding({
                      uri: buttonText === 'Add' ? 'green-button' :
                           buttonText === 'Remove' ? 'red-button' :
                           'standard-button'
                    }),
                    style: {
                      position: 'absolute',
                      width: buttonWidth,
                      height: buttonHeight,
                      top: 0,
                      left: 0,
                    },
                  }),
                  // Button text
                  View({
                    style: {
                      position: 'absolute',
                      width: buttonWidth,
                      height: buttonHeight,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    children: Text({
                      text: new Binding(buttonText),
                      style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: COLORS.textPrimary,
                        fontWeight: 'bold',
                      },
                    }),
                  }),
                ],
              })
            ),
          }),
        ],
      }),
    ],
  });
}
