/**
 * Card Detail Popup Component
 * Shows card details in a popup overlay with action buttons
 */

import type { CardDetailDisplay } from '../../../../bloombeasts/gameManager';
import { UINodeType } from '../ScreenUtils';
import { createCardComponent, createReactiveCardComponent } from './CardRenderer';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import { createPopup, type PopupButton } from '../../common/Popup';
import { BindingType, type UIState } from '../../types/BindingManager';

export interface CardDetailPopupProps {
  cardDetail: CardDetailDisplay;
  onButtonClick: (buttonId: string) => void;
  playSfx?: (sfxId: string) => void;
  hideBackdrop?: boolean; // Hide the semi-transparent backdrop
}

export interface ReactiveCardDetailPopupProps {
  onClose: () => void;
  buttons?: PopupButton[]; // Buttons to display at bottom
  playSfx?: (sfxId: string) => void;
}

/**
 * Create a reactive card detail popup overlay using common Popup
 */
export function createReactiveCardDetailPopup(ui: UIMethodMappings, props: ReactiveCardDetailPopupProps): UINodeType {
  const { onClose, buttons = [], playSfx } = props;

  // Derive card name using instance method (no new binding)
  const cardNameBinding = ui.bindingManager.derive([BindingType.UIState], (uiState: UIState) => {
    const pd = ui.bindingManager.getSnapshot(BindingType.PlayerData);
    const card = pd?.cards?.collected?.find((c: any) => c.id === uiState.cards?.selectedCardId);
    return card?.name || 'Card Details';
  });

  // Create content with card display (centered)
  const content = [
    ui.View({
      style: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: createReactiveCardComponent(ui, {
        mode: 'selectedCard',
        onClick: undefined, // No click handler in popup
        showDeckIndicator: true, // Show deck indicator
      }),
    }),
  ];

  return createPopup({
    ui,
    title: cardNameBinding,
    content,
    buttons, // Buttons will be centered at bottom in a row
    playSfx,
    width: 450,
    height: 520,
    onBackdropClick: onClose,
  });
}

/**
 * Create a card detail popup overlay using common Popup component
 */
export function createCardDetailPopup(ui: UIMethodMappings, props: CardDetailPopupProps): UINodeType {
  const { cardDetail, onButtonClick, playSfx, hideBackdrop = false } = props;

  // Create card component as content
  const cardContent = [
    ui.View({
      style: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      children: createCardComponent(ui, {
        card: cardDetail.card,
        isInDeck: cardDetail.isInDeck,
        showDeckIndicator: false, // Don't show deck indicator in detail view
      }),
    }),
  ];

  // Convert buttons to PopupButton format
  const popupButtons: PopupButton[] = (cardDetail.buttons || [])
    .filter(b => b)
    .map((buttonText) => ({
      label: buttonText,
      onClick: () => {
        const buttonId = `btn-card-${buttonText.toLowerCase().replace(/ /g, '-')}`;
        onButtonClick(buttonId);
      },
      color: buttonText === 'Add' ? 'green' : buttonText === 'Remove' ? 'red' : 'default',
    }));

  return createPopup({
    ui,
    title: cardDetail.card.name || 'Card Details',
    content: cardContent,
    buttons: popupButtons,
    playSfx,
    width: 400,
    height: 500,
    onBackdropClick: () => onButtonClick('btn-card-close'),
    hideBackdrop,
  });
}
