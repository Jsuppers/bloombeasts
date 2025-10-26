/**
 * Card Detail Popup Component
 * Shows card details in a popup overlay with action buttons
 */

import { COLORS } from '../../styles/colors';
import { DIMENSIONS, GAPS } from '../../styles/dimensions';
import { sideMenuButtonDimensions } from '../../constants/dimensions';
import type { CardDetailDisplay, MenuStats } from '../../../../bloombeasts/gameManager';
import { UINodeType } from '../ScreenUtils';
import { createCardComponent } from './CardRenderer';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';

export interface CardDetailPopupProps {
  cardDetail: CardDetailDisplay;
  onButtonClick: (buttonId: string) => void;
}

/**
 * Create a card detail popup overlay
 */
export function createCardDetailPopup(ui: UIMethodMappings, props: CardDetailPopupProps): UINodeType {
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

  return ui.View({
    style: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    children: [
      // Black backdrop - clicking closes the popup
      ui.Pressable({
        onClick: () => onButtonClick('btn-card-close'),
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }),

      // Content container (centered)
      ui.View({
        style: {
          position: 'absolute',
          left: contentX,
          top: contentY,
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
        children: [
          // Card display
          createCardComponent(ui, {
            card: cardDetail.card,
            isInDeck: cardDetail.isInDeck,
            showDeckIndicator: false, // Don't show deck indicator in detail view
          }),

          // Buttons to the right
          ui.View({
            style: {
              marginLeft: DIMENSIONS.spacing.xl,
              flexDirection: 'column',
            },
            children: (cardDetail.buttons || []).filter(b => b).map((buttonText, index) =>
              ui.Pressable({
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
                  ui.Image({
                    imageId: buttonText === 'Add' ? 'green-button' :
                            buttonText === 'Remove' ? 'red-button' :
                            'standard-button',
                    style: {
                      position: 'absolute',
                      width: buttonWidth,
                      height: buttonHeight,
                      top: 0,
                      left: 0,
                    },
                  }),
                  // Button text
                  ui.View({
                    style: {
                      position: 'absolute',
                      width: buttonWidth,
                      height: buttonHeight,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    children: ui.Text({
                      text: new ui.Binding(buttonText),
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
