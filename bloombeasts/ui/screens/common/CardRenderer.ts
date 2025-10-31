/**
 * Common Card Rendering Component
 * Reusable card display with multi-layer rendering
 */

import { COLORS } from '../../styles/colors';
import { DIMENSIONS } from '../../styles/dimensions';
import type { CardInstance } from '../../../screens/cards/types';
import { computeCardDisplay, type CardDisplayData } from '../../../utils/cardUtils';
import { getCardDescription } from '../../../engine/utils/cardDescriptionGenerator';
import { UINodeType } from '../ScreenUtils';
import type { PlayerData, UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import type { BattleDisplay } from '../../../../bloombeasts/gameManager';
import { BindingType, UIState } from '../../types/BindingManager';

export interface CardRendererProps {
  card: CardDisplayData;
  isInDeck?: boolean;
  onClick?: (cardId: string) => void;
  showDeckIndicator?: boolean;
}

/**
 * Create a card UI component with proper multi-layer rendering
 * This follows the standard card format:
 * - Layer 1: Card artwork (185x185) - beast image for Bloom, card art for others
 * - Layer 2: Card frame (210x280) - base-card for Bloom, type-specific for others (buff-card, magic-card, etc.)
 * - Layer 3: Affinity icon (for Bloom cards)
 * - Layer 4: Experience bar (for Bloom cards with levels)
 * - Layer 5: Text overlays (name, cost, stats, level, ability)
 * - Layer 6: Deck indicator (if showDeckIndicator is true)
 */
export function createCardComponent(ui: UIMethodMappings, props: CardRendererProps): UINodeType {
  const { card, isInDeck = false, onClick, showDeckIndicator = true } = props;

  // Standard card dimensions from shared constants
  const cardWidth = 210; // standardCardDimensions.width
  const cardHeight = 280; // standardCardDimensions.height
  const beastImageWidth = 185; // standardCardBeastImageDimensions.width
  const beastImageHeight = 185; // standardCardBeastImageDimensions.height

  // Standard card positions (offsets within the card)
  const positions = {
    beastImage: { x: 12, y: 13 },
    cost: { x: 20, y: 10 },
    affinity: { x: 175, y: 7 },
    level: { x: 105, y: 182 },
    experienceBar: { x: 44, y: 182 },
    name: { x: 105, y: 13 },
    ability: { x: 21, y: 212 },
    attack: { x: 20, y: 176 },
    health: { x: 188, y: 176 },
  };

  // Extract base card ID for asset lookup
  // Card IDs may have timestamp suffixes (e.g., "nectar-block-1761200302194-0")
  // We need to extract the base ID (e.g., "nectar-block") to match catalog IDs
  const extractBaseId = (id: string | undefined): string => {
    if (!id) {
      console.warn('[CardRenderer] Card missing id, using name fallback:', card);
      // Fallback: use card name converted to kebab-case
      return card.name.toLowerCase().replace(/\s+/g, '-');
    }
    // Remove timestamp pattern: -digits-digits at the end
    return id.replace(/-\d+-\d+$/, '');
  };

  // Generate unique image URI keys for this card
  // Extract base ID from card.id to match asset catalog IDs
  const baseId = extractBaseId(card.id);
  const cardImageKey = baseId; // Card images use the base card ID
  const beastImageKey = baseId; // Beast images use the base card ID

  // Card frame key: Bloom cards use base-card, others use type-specific frames
  let cardFrameKey = '';
  if (card.type === 'Bloom') {
    cardFrameKey = 'base-card';
  } else if (card.type === 'Habitat' && card.affinity) {
    cardFrameKey = `${card.affinity.toLowerCase()}-habitat`;
  } else {
    cardFrameKey = `${card.type.toLowerCase()}-card`;
  }

  // Affinity icon key format: affinity-icon (e.g., 'forest-icon', 'fire-icon')
  const affinityKey = card.affinity ? `${card.affinity.toLowerCase()}-icon` : '';
  const expBarKey = 'experience-bar';

  // Get card description for ability text using the official cardDescriptionGenerator
  const abilityText = getCardDescription(card);

  // Debug logging for cards without descriptions
  if ((!abilityText || abilityText.trim() === '') && card.type !== 'Bloom') {
  } else if (card.type !== 'Bloom') {
  }

  const imageSourceKey = card.type === 'Bloom' ? beastImageKey : cardImageKey;

  const children = [
      // Layer 1: Card/Beast artwork image (185x185)
      // For Bloom cards: use beast image
      // For other cards (Magic/Trap/Buff/Habitat): use card artwork image
      ui.Image({
        source: ui.assetIdToImageSource?.(imageSourceKey) || null,
        style: {
          width: beastImageWidth,
          height: beastImageHeight,
          position: 'absolute',
          top: positions.beastImage.y,
          left: positions.beastImage.x,
        },
      }),

      // Layer 2: Card frame - Bloom cards use base-card, others use type-specific frames
      ui.Image({
        source: ui.assetIdToImageSource?.(cardFrameKey) || null,
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'absolute',
          top: 0,
          left: 0,
        },
      }),

      // Layer 3: Affinity icon (for Bloom cards)
      ...(card.type === 'Bloom' && card.affinity && affinityKey ? [
        ui.Image({
          source: ui.assetIdToImageSource?.(affinityKey) || null,
          style: {
            width: 30,
            height: 30,
            position: 'absolute',
            top: positions.affinity.y,
            left: positions.affinity.x,
          },
        })
      ] : []),

      // Layer 4: Text overlays
      // Card name
      ui.Text({
        text: card.name || '',
        style: {
          position: 'absolute',
          top: positions.name.y,
          left: 0,
          width: cardWidth,
          fontSize: DIMENSIONS.fontSize.md,
          color: COLORS.textPrimary,
          textAlign: 'center',
        },
      }),

      // Cost (top-left)
      ...(card.cost !== undefined ? [
        ui.Text({
          text: String(card.cost),
          style: {
            position: 'absolute',
            top: positions.cost.y,
            left: positions.cost.x - 10,
            width: 20,
            fontSize: DIMENSIONS.fontSize.xxl,
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        })
      ] : []),

      // Attack and Health (for Bloom cards)
      ...(card.type === 'Bloom' && ((card as any).currentAttack !== undefined || (card as any).baseAttack !== undefined) ? [
        ui.Text({
          text: String((card as any).currentAttack ?? (card as any).baseAttack ?? 0),
          style: {
            position: 'absolute',
            top: positions.attack.y,
            left: positions.attack.x - 10,
            width: 20,
            fontSize: DIMENSIONS.fontSize.xxl,
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        })
      ] : []),

      ...(card.type === 'Bloom' && ((card as any).currentHealth !== undefined || (card as any).baseHealth !== undefined) ? [
        ui.Text({
          text: String((card as any).currentHealth ?? (card as any).baseHealth ?? 0),
          style: {
            position: 'absolute',
            top: positions.health.y,
            left: positions.health.x - 10,
            width: 20,
            fontSize: DIMENSIONS.fontSize.xxl,
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        })
      ] : []),

      // Level and Experience (for all cards with level)
      ...(card.level !== undefined ? [
        ui.Text({
          text: `lvl ${card.level}. ${card.experience || 0}/${card.experienceRequired || 0}`,
          style: {
            position: 'absolute',
            top: positions.level.y,
            left: 0,
            width: cardWidth,
            fontSize: DIMENSIONS.fontSize.xs,
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        })
      ] : []),

      // Ability/Effect text (for all cards)
      ...(abilityText ? [
        ui.Text({
          text: abilityText,
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
        })
      ] : []),

      // Deck indicator border if in deck and showDeckIndicator is true
      ...(isInDeck && showDeckIndicator ? [
        ui.View({
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: cardWidth,
            height: cardHeight,
            borderWidth: 4,
            borderColor: COLORS.success,
            borderRadius: 8,
          },
        })
      ] : []),
    ];

  // Filter out any undefined values to prevent rendering errors
  const filteredChildren = children.filter(child => child !== undefined && child !== null);

  // Only wrap in Pressable if onClick is provided
  // Otherwise use View to avoid blocking parent click handlers
  if (onClick) {
    return ui.Pressable({
      onClick: () => onClick(card.id),
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
      },
      children: filteredChildren,
    });
  } else {
    return ui.View({
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
      },
      children: filteredChildren,
    });
  }
}

/**
 * Props for reactive card component that uses bindings
 */
export interface ReactiveCardRendererProps {

  // Mode selection
  mode: 'selectedCard' | 'slot' | 'battleBeast' | 'battleHand' | 'battleSelectedCard';

  // Slot-based selection (required for slot and battle modes)
  slotIndex?: number;
  cardsPerPage?: number;

  // Battle-specific props
  player?: 'player' | 'opponent'; // Required for battleBeast mode

  onClick?: (cardId: string) => void;
  showDeckIndicator?: boolean;
}

/**
 * Create a reactive card UI component using bindings
 */
export function createReactiveCardComponent(ui: UIMethodMappings, props: ReactiveCardRendererProps): UINodeType {
  const {
    mode,
    slotIndex,
    cardsPerPage,
    player,
    onClick,
    showDeckIndicator = true
  } = props;

  // Determine which mode we're in
  const isSelectedCardMode = mode === 'selectedCard';
  const isSlotMode = mode === 'slot';
  const isBattleBeastMode = mode === 'battleBeast';
  const isBattleHandMode = mode === 'battleHand';
  const isBattleSelectedCardMode = mode === 'battleSelectedCard';

  // Standard card dimensions
  const cardWidth = 210;
  const cardHeight = 280;
  const beastImageWidth = 185;
  const beastImageHeight = 185;

  // Standard card positions
  const positions = {
    beastImage: { x: 12, y: 13 },
    cost: { x: 21, y: 7 },
    affinity: { x: 171, y: 7 },
    level: { x: 105, y: 182 },
    experienceBar: { x: 44, y: 182 },
    name: { x: 105, y: 13 },
    ability: { x: 21, y: 212 },
    attack: { x: 21, y: 171 },
    health: { x: 188, y: 171 },
  };

  // Helper function to extract base ID
  const extractBaseId = (id: string | undefined, name: string): string => {
    if (!id) {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
    return id.replace(/-\d+-\d+$/, '');
  };

  // Helper to get card from combined data
  // Now accepts uiState, playerData, and battleDisplay to properly react to changes
  const getCard = (uiState: UIState, playerData: PlayerData, battleDisplay: BattleDisplay | null): CardDisplayData | null => {
    // Battle modes - get card directly from battleDisplay
    if (isBattleBeastMode && slotIndex !== undefined && player) {
      if (!battleDisplay) return null;
      const field = player === 'player' ? battleDisplay.playerField : battleDisplay.opponentField;
      const beast = field?.[slotIndex];
      return beast || null; // BattleDisplay cards are already in CardDisplayData format
    }

    if (isBattleHandMode && slotIndex !== undefined && cardsPerPage !== undefined) {
      if (!battleDisplay) return null;
      const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
      const actualIndex = scrollOffset * cardsPerPage + slotIndex;
      const card = battleDisplay.playerHand?.[actualIndex];
      return card || null; // BattleDisplay cards are already in CardDisplayData format
    }

    if (isBattleSelectedCardMode) {
      const card = uiState.battle?.selectedCardDetail;
      return card || null; // BattleDisplay cards are already in CardDisplayData format
    }

    // PlayerData modes - get card from collected cards
    const cardInstances: CardInstance[] = playerData?.cards?.collected || [];

    let instance: CardInstance | null = null;

    if (isSelectedCardMode) {
      const cardId = uiState.cards?.selectedCardId;
      // ID-based mode: find card by ID
      if (!cardId) return null;
      instance = cardInstances.find((c: CardInstance) => c.id === cardId) || null;
    } else if (isSlotMode && slotIndex !== undefined && cardsPerPage !== undefined) {
      // Slot-based mode: find card by slot index
      const pageStart = (uiState.cards?.scrollOffset ?? 0) * cardsPerPage;
      const cardIndex = pageStart + slotIndex;
      instance = cardIndex < cardInstances.length ? cardInstances[cardIndex] : null;
    }

    // Compute display data from instance
    return instance ? computeCardDisplay(instance) : null;
  };


  // Helper to check if card is in deck
  const isCardInDeck = (playerData: PlayerData, cardId: string | undefined): boolean => {
    if (!showDeckIndicator || !cardId) return false;
    const deckCardIds: string[] = playerData?.cards?.deck || [];
    return deckCardIds.includes(cardId);
  };

  // Determine which bindings to watch based on mode
  const isBattleMode = isBattleBeastMode || isBattleHandMode || isBattleSelectedCardMode;
  const bindingTypes = isBattleMode
    ? [BindingType.UIState, BindingType.BattleDisplay]
    : [BindingType.UIState, BindingType.PlayerData];

  // Create reactive text bindings that watch the appropriate bindings
  // Battle modes: UIState + BattleDisplay
  // Card screen modes: UIState + PlayerData
  const cardNameBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    return card?.name || '';
  });

  const cardCostBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    return card && card.cost !== undefined ? String(card.cost) : '';
  });

  const cardAttackBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    if (!card || card.type !== 'Bloom') return '';
    const bloomCard = card as any;
    return String(bloomCard.currentAttack ?? bloomCard.baseAttack ?? 0);
  });

  const cardHealthBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    if (!card || card.type !== 'Bloom') return '';
    const bloomCard = card as any;
    return String(bloomCard.currentHealth ?? bloomCard.baseHealth ?? 0);
  });

  const cardLevelBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    if (!card || card.level === undefined) return '';

    // For all cards, show level and experience
    const exp = card.experience || 0;
    const expRequired = card.experienceRequired || 0;
    return `lvl ${card.level}. ${exp}/${expRequired}`;
  });

  const abilityTextBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    return card ? getCardDescription(card) : '';
  });

  // Create image source bindings that watch the appropriate bindings
  const baseCardImageBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    if (!card) return null;
    const baseId = extractBaseId(card.id, card.name);
    if (!baseId) return null;
    return ui.assetIdToImageSource?.(baseId) ?? null;
  });

  const templateImageBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    if (!card) return null;

    let templateAssetId = '';
    if (card.type === 'Habitat' && card.affinity) {
      templateAssetId = `${card.affinity.toLowerCase()}-habitat`;
    } else if (card.type !== 'Bloom') {
      templateAssetId = `${card.type.toLowerCase()}-card`;
    }

    return templateAssetId ? (ui.assetIdToImageSource?.(templateAssetId) ?? null) : null;
  });

  const affinityIconBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
    const [uiState, data] = args;
    const card = isBattleMode
      ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
      : getCard(uiState, data as PlayerData, null);
    if (!card || card.type !== 'Bloom' || !card.affinity) return null;
    const affinityAssetId = `${card.affinity.toLowerCase()}-icon`;
    if (!affinityAssetId) return null;
    return ui.assetIdToImageSource?.(affinityAssetId) ?? null;
  });


  // Render all layers without conditional wrapping
  // Null/empty values will naturally hide elements
  const children = [
    // Layer 1: Card/Beast artwork image
    ui.Image({
      source: baseCardImageBinding,
      style: {
        width: beastImageWidth,
        height: beastImageHeight,
        position: 'absolute',
        top: positions.beastImage.y,
        left: positions.beastImage.x,
      },
    }),

    // Layer 2: Card frame (base-card for Bloom, type-specific for others)
    ui.Image({
      source: ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
        const [uiState, data] = args;
        const card = isBattleMode
          ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
          : getCard(uiState, data as PlayerData, null);
        if (!card) return null;

        // Bloom cards use base-card
        if (card.type === 'Bloom') {
          return ui.assetIdToImageSource?.('base-card') ?? null;
        }

        // Other cards use their type-specific frame
        let frameAssetId = '';
        if (card.type === 'Habitat' && card.affinity) {
          frameAssetId = `${card.affinity.toLowerCase()}-habitat`;
        } else {
          frameAssetId = `${card.type.toLowerCase()}-card`;
        }

        return frameAssetId ? (ui.assetIdToImageSource?.(frameAssetId) ?? null) : null;
      }),
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'absolute',
        top: 0,
        left: 0,
      },
    }),

    // Layer 4: Affinity icon
    ui.Image({
      source: affinityIconBinding,
      style: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: positions.affinity.y,
        left: positions.affinity.x,
      },
    }),

    // Layer 5: Text overlays
    // Card name
    ui.Text({
      text: cardNameBinding,
      style: {
        position: 'absolute',
        top: positions.name.y,
        left: 0,
        width: cardWidth,
        fontSize: DIMENSIONS.fontSize.md,
        color: COLORS.textPrimary,
        textAlign: 'center',
      },
    }),

    // Cost
    ui.Text({
      text: cardCostBinding,
      style: {
        position: 'absolute',
        top: positions.cost.y,
        left: positions.cost.x - 10,
        width: 20,
        fontSize: DIMENSIONS.fontSize.xxl,
        color: COLORS.textPrimary,
        textAlign: 'center',
      },
    }),

    // Attack
    ui.Text({
      text: cardAttackBinding,
      style: {
        position: 'absolute',
        top: positions.attack.y,
        left: positions.attack.x - 10,
        width: 20,
        fontSize: DIMENSIONS.fontSize.xxl,
        color: COLORS.textPrimary,
        textAlign: 'center',
      },
    }),

    // Health
    ui.Text({
      text: cardHealthBinding,
      style: {
        position: 'absolute',
        top: positions.health.y,
        left: positions.health.x - 10,
        width: 20,
        fontSize: DIMENSIONS.fontSize.xxl,
        color: COLORS.textPrimary,
        textAlign: 'center',
      },
    }),

    // Level
    ui.Text({
      text: cardLevelBinding,
      style: {
        position: 'absolute',
        top: positions.level.y,
        left: 0,
        width: cardWidth,
        fontSize: DIMENSIONS.fontSize.xs,
        color: COLORS.textPrimary,
        textAlign: 'center',
      },
    }),

    // Ability text
    ui.Text({
      text: abilityTextBinding,
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

    // Layer 7: Deck indicator border (only if showDeckIndicator is true and not in battle mode)
    ...(showDeckIndicator && !isBattleMode ? [ui.View({
      style: ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
        const card = getCard(uiState, playerData, null);
        const inDeck = isCardInDeck(playerData, card?.id);

        return {
          position: 'absolute',
          top: 0,
          left: 0,
          width: cardWidth,
          height: cardHeight,
          borderWidth: inDeck ? 4 : 0,
          borderColor: COLORS.success,
          borderRadius: 8,
          pointerEvents: 'none' as const, // Allow clicks to pass through
        };
      }),
    })] : []),
  ];

  const filteredChildren = children.filter(child => child !== undefined && child !== null);

  // Wrap in Pressable if onClick is provided, otherwise use View
  if (onClick) {
    return ui.Pressable({
      onClick: () => {
        // Get current state to determine which card was clicked
        const currentState = ui.bindingManager.getSnapshot(BindingType.UIState);
        const playerData = ui.bindingManager.getSnapshot(BindingType.PlayerData);
        const card = getCard(currentState, playerData, null);
        if (card?.id) {
          onClick(card.id);
        }
      },
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
      },
      children: filteredChildren,
    });
  } else {
    return ui.View({
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
      },
      children: filteredChildren,
    });
  }
}

/**
 * Standard card dimensions for external use
 */
export const CARD_DIMENSIONS = {
  width: 210,
  height: 280,
  imageWidth: 185,
  imageHeight: 185,
};
