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
import { getCardDescription } from '../../../engine/utils/cardDescriptionGenerator';

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
 * Create a reactive card detail popup that derives content from CardDetailPopup binding
 */
export function createReactiveCardDetailPopupFromBinding(ui: UIMethodMappings): UINodeType {
  // Get snapshot for non-reactive parts (buttons, callbacks)
  const propsSnapshot = ui.bindingManager.getSnapshot(BindingType.CardDetailPopup);

  // Derive title from binding
  const titleBinding = ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
    return props?.cardDetail?.card?.name || 'Card Details';
  });

  // Build card structure with reactive bindings (can't use createCardComponent with null data)
  const cardWidth = 210;
  const cardHeight = 280;
  const beastImageWidth = 185;
  const beastImageHeight = 185;

  const positions = {
    beastImage: { x: 12, y: 13 },
    cost: { x: 21, y: 7 },
    affinity: { x: 171, y: 7 },
    name: { x: 105, y: 13 },
    ability: { x: 21, y: 212 },
    attack: { x: 21, y: 171 },
    health: { x: 188, y: 171 },
  };

  const cardContent = [
    ui.View({
      style: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      children: ui.View({
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'relative',
        },
        children: [
          // Layer 1: Card/Beast artwork
          ui.Image({
            source: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              const card = props?.cardDetail?.card;
              if (!card || !card.id) return null;
              const baseId = card.id?.replace(/-\d+-\d+$/, '') || card.name?.toLowerCase().replace(/\s+/g, '-');
              return ui.assetIdToImageSource?.(baseId) || null;
            }),
            style: {
              width: beastImageWidth,
              height: beastImageHeight,
              position: 'absolute',
              top: positions.beastImage.y,
              left: positions.beastImage.x,
            },
          }),

          // Layer 2: Card frame
          ui.Image({
            source: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              const card = props?.cardDetail?.card;
              if (!card) return null;

              let templateKey = '';
              if (card.type === 'Bloom') {
                templateKey = 'base-card';
              } else if (card.type === 'Habitat' && card.affinity) {
                templateKey = `${card.affinity.toLowerCase()}-habitat`;
              } else {
                templateKey = `${card.type.toLowerCase()}-card`;
              }
              return ui.assetIdToImageSource?.(templateKey) || null;
            }),
            style: {
              width: cardWidth,
              height: cardHeight,
              position: 'absolute',
              top: 0,
              left: 0,
            },
          }),

          // Layer 3: Affinity icon (for Bloom cards)
          ui.Image({
            source: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              const card = props?.cardDetail?.card;
              if (!card || card.type !== 'Bloom' || !card.affinity) return null;
              return ui.assetIdToImageSource?.(`${card.affinity.toLowerCase()}-icon`) || null;
            }),
            style: {
              width: 30,
              height: 30,
              position: 'absolute',
              top: positions.affinity.y,
              left: positions.affinity.x,
            },
          }),

          // Layer 4: Card name
          ui.Text({
            text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              return props?.cardDetail?.card?.name || '';
            }),
            style: {
              position: 'absolute',
              top: positions.name.y,
              left: 0,
              width: cardWidth,
              fontSize: 14,
              color: '#fff',
              textAlign: 'center',
            },
          }),

          // Layer 5: Cost
          ui.Text({
            text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              const card = props?.cardDetail?.card;
              return card && card.cost !== undefined ? String(card.cost) : '';
            }),
            style: {
              position: 'absolute',
              top: positions.cost.y,
              left: positions.cost.x - 10,
              width: 20,
              fontSize: 24,
              color: '#fff',
              textAlign: 'center',
            },
          }),

          // Layer 6: Attack (for Bloom cards)
          ui.Text({
            text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              const card = props?.cardDetail?.card;
              if (!card || card.type !== 'Bloom') return '';
              return String((card as any).currentAttack ?? (card as any).baseAttack ?? 0);
            }),
            style: {
              position: 'absolute',
              top: positions.attack.y,
              left: positions.attack.x - 10,
              width: 20,
              fontSize: 24,
              color: '#fff',
              textAlign: 'center',
            },
          }),

          // Layer 7: Health (for Bloom cards)
          ui.Text({
            text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              const card = props?.cardDetail?.card;
              if (!card || card.type !== 'Bloom') return '';
              return String((card as any).currentHealth ?? (card as any).baseHealth ?? 0);
            }),
            style: {
              position: 'absolute',
              top: positions.health.y,
              left: positions.health.x - 10,
              width: 20,
              fontSize: 24,
              color: '#fff',
              textAlign: 'center',
            },
          }),

          // Layer 8: Ability text
          ui.Text({
            text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              const card = props?.cardDetail?.card;
              if (!card) return '';
              return getCardDescription(card);
            }),
            numberOfLines: 3,
            style: {
              position: 'absolute',
              top: positions.ability.y,
              left: positions.ability.x,
              width: 168,
              fontSize: 16,
              color: '#000000',
              textAlign: 'left',
            },
          }),
        ],
      }),
    }),
  ];

  // Get buttons from binding
  const popupButtons: PopupButton[] = (propsSnapshot?.cardDetail?.buttons || [])
    .filter((b: any) => b)
    .map((buttonText: string) => ({
      label: buttonText,
      onClick: () => {
        const buttonId = `btn-card-${buttonText.toLowerCase().replace(/ /g, '-')}`;
        propsSnapshot?.onButtonClick?.(buttonId);
      },
      color: (buttonText === 'Add' ? 'green' : buttonText === 'Remove' ? 'red' : 'default') as ButtonColor,
    }));

  return createPopup({
    ui,
    title: titleBinding,
    content: cardContent,
    buttons: popupButtons,
    playSfx: propsSnapshot?.playSfx,
    width: 400,
    height: 500,
    onBackdropClick: () => propsSnapshot?.onButtonClick?.('btn-card-close'),
    hideBackdrop: propsSnapshot?.hideBackdrop || false,
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
