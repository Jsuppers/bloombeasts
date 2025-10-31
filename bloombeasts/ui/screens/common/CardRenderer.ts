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
 * - Layer 2: Base card frame (210x280) - BaseCard.png
 * - Layer 3: Type-specific template overlay (MagicCard, TrapCard, etc.)
 * - Layer 4: Affinity icon (for Bloom cards)
 * - Layer 5: Experience bar (for Bloom cards with levels)
 * - Layer 6: Text overlays (name, cost, stats, level, ability)
 * - Layer 7: Deck indicator (if showDeckIndicator is true)
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
  const baseCardKey = 'base-card'; // All cards use base-card as the frame

  // Type-specific template overlay
  // Habitat cards use habitat templates from affinity folders
  let templateKey = '';
  if (card.type === 'Habitat' && card.affinity) {
    // Template key format: affinity-habitat (e.g., 'forest-habitat')
    templateKey = `${card.affinity.toLowerCase()}-habitat`;
  } else if (card.type !== 'Bloom') {
    templateKey = `${card.type.toLowerCase()}-card`;
  }

  // Affinity icon key format: affinity-icon (e.g., 'forest-icon', 'fire-icon')
  const affinityKey = card.affinity ? `${card.affinity.toLowerCase()}-icon` : '';
  const expBarKey = 'experience-bar';

  // Get card description for ability text using the official cardDescriptionGenerator
  const abilityText = getCardDescription(card);

  // Debug logging for cards without descriptions
  if ((!abilityText || abilityText.trim() === '') && card.type !== 'Bloom') {
    console.log(`[CardRenderer] ❌ No description for ${card.name} (${card.type}, id: ${card.id})`);
    console.log(`  Abilities:`, card.abilities);
    console.log(`  Generated abilityText: "${abilityText}"`);
  } else if (card.type !== 'Bloom') {
    console.log(`[CardRenderer] ✅ ${card.name} (${card.type}): "${abilityText}"`);
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

      // Layer 2: Base card frame (210x280) - ALL cards use BaseCard.png
      ui.Image({
        source: ui.assetIdToImageSource?.(baseCardKey) || null,
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'absolute',
          top: 0,
          left: 0,
        },
      }),

      // Layer 2.5: Template overlay for non-Bloom cards (Magic/Trap/Buff/Habitat)
      ...(templateKey ? [
        ui.Image({
          source: ui.assetIdToImageSource?.(templateKey) || null,
          style: {
            width: cardWidth,
            height: cardHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          },
        })
      ] : []),

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

      // Layer 4: Experience bar (for Bloom cards with level)
      ...(card.type === 'Bloom' && card.level ? [
        ui.Image({
          source: ui.assetIdToImageSource?.(expBarKey) || null,
          style: {
            width: 120,
            height: 20,
            position: 'absolute',
            top: positions.experienceBar.y,
            left: positions.experienceBar.x,
          },
        })
      ] : []),

      // Layer 5: Text overlays
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

      // Level (for all cards)
      ...(card.level !== undefined ? [
        ui.Text({
          text: `Level ${card.level}`,
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
            fontSize: DIMENSIONS.fontSize.xs,
            color: COLORS.textPrimary,
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
  mode: 'selectedCard' | 'slot';

  // Slot-based selection (required for slot mode)
  slotIndex?: number;
  cardsPerPage?: number;

  onClick?: () => void;
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
    onClick,
    showDeckIndicator = true
  } = props;

  // Determine which mode we're in
  const isSelectedCardMode = mode === 'selectedCard';
  const isSlotMode = mode === 'slot';

  // Standard card dimensions
  const cardWidth = 210;
  const cardHeight = 280;
  const beastImageWidth = 185;
  const beastImageHeight = 185;

  // Standard card positions
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

  // Helper function to extract base ID
  const extractBaseId = (id: string | undefined, name: string): string => {
    if (!id) {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
    return id.replace(/-\d+-\d+$/, '');
  };

  // Helper to get card from combined data
  // Now accepts both uiState and playerData to properly react to changes
  const getCard = (uiState: UIState, playerData: PlayerData): CardDisplayData | null => {
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

  // Create reactive text bindings that watch BOTH UIState and PlayerData
  // This ensures the bindings update when either the selected card changes OR the card data changes
  const cardNameBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    return card?.name || '';
  });

  const cardCostBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    return card && card.cost !== undefined ? String(card.cost) : '';
  });

  const cardAttackBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    if (!card || card.type !== 'Bloom') return '';
    const bloomCard = card as any;
    return String(bloomCard.currentAttack ?? bloomCard.baseAttack ?? 0);
  });

  const cardHealthBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    if (!card || card.type !== 'Bloom') return '';
    const bloomCard = card as any;
    return String(bloomCard.currentHealth ?? bloomCard.baseHealth ?? 0);
  });

  const cardLevelBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    return card && card.level !== undefined ? `Level ${card.level}` : '';
  });

  const abilityTextBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    return card ? getCardDescription(card) : '';
  });

  // Create image source bindings that watch BOTH UIState and PlayerData
  const baseCardImageBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    if (!card) return null;
    const baseId = extractBaseId(card.id, card.name);
    if (!baseId) return null;
    return ui.assetIdToImageSource?.(baseId) ?? null;
  });

  const templateImageBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
    if (!card) return null;

    let templateAssetId = '';
    if (card.type === 'Habitat' && card.affinity) {
      templateAssetId = `${card.affinity.toLowerCase()}-habitat`;
    } else if (card.type !== 'Bloom') {
      templateAssetId = `${card.type.toLowerCase()}-card`;
    }

    return templateAssetId ? (ui.assetIdToImageSource?.(templateAssetId) ?? null) : null;
  });

  const affinityIconBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
    const card = getCard(uiState, playerData);
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

    // Layer 2: Base card frame
    ui.Image({
      source: ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
        const card = getCard(uiState, playerData);
        return card ? ui.assetIdToImageSource?.('base-card') : null;
      }),
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'absolute',
        top: 0,
        left: 0,
      },
    }),

    // Layer 3: Template overlay
    ui.Image({
      source: templateImageBinding,
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

    // Layer 5: Experience bar
    ui.Image({
      source: ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
        const card = getCard(uiState, playerData);
        if (!card || card.type !== 'Bloom' || card.level === undefined) return null;
        return ui.assetIdToImageSource?.('experience-bar');
      }),
      style: {
        width: 120,
        height: 20,
        position: 'absolute',
        top: positions.experienceBar.y,
        left: positions.experienceBar.x,
      },
    }),

    // Layer 6: Text overlays
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
        fontSize: DIMENSIONS.fontSize.xs,
        color: COLORS.textPrimary,
        textAlign: 'left',
      },
    }),

    // Layer 7: Deck indicator border (only if showDeckIndicator is true)
    ...(showDeckIndicator ? [ui.View({
      style: ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
        const card = getCard(uiState, playerData);
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
        };
      }),
    })] : []),
  ];

  const filteredChildren = children.filter(child => child !== undefined && child !== null);

  // Wrap in Pressable if onClick is provided, otherwise use View
  if (onClick) {
    return ui.Pressable({
      onClick: () => {
        console.log('[CardRenderer] Pressable clicked');
        onClick();
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
