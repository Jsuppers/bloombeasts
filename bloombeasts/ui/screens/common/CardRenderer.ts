/**
 * Common Card Rendering Component
 * Reusable card display with multi-layer rendering
 */

import { View, Text, Image, Pressable, Binding } from '../../index';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS } from '../../../../shared/styles/dimensions';
import type { CardDisplay } from '../../../../bloombeasts/gameManager';
import { getCardDescription } from '../../../engine/utils/cardDescriptionGenerator';
import { UINodeType } from '../ScreenUtils';

export interface CardRendererProps {
  card: CardDisplay;
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
export function createCardComponent(props: CardRendererProps): UINodeType {
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

  // Generate unique image URI keys for this card
  const cardImageKey = `card-${card.name}`; // For non-Bloom cards
  const beastImageKey = `beast-${card.name}`; // For Bloom cards
  const baseCardKey = 'baseCard'; // All cards use BaseCard as the frame

  // Type-specific template overlay
  // Habitat cards use HabitatCard.png from affinity folders (e.g., Forest/HabitatCard.png)
  let templateKey = '';
  if (card.type === 'Habitat' && card.affinity) {
    // Template key format: affinity-habitat (e.g., 'forest-habitat')
    templateKey = `${card.affinity.toLowerCase()}-habitat`;
  } else if (card.type !== 'Bloom') {
    templateKey = `${card.type.toLowerCase()}Card`;
  }

  const affinityKey = card.affinity ? `affinity-${card.affinity}` : '';
  const expBarKey = 'experienceBar';

  // Get card description for ability text using the official cardDescriptionGenerator
  const abilityText = getCardDescription(card);

  return Pressable({
    onClick: onClick ? () => onClick(card.id) : undefined,
    style: {
      width: cardWidth,
      height: cardHeight,
      position: 'relative',
    },
    children: [
      // Layer 1: Card/Beast artwork image (185x185)
      // For Bloom cards: use beast image
      // For other cards (Magic/Trap/Buff/Habitat): use card artwork image
      Image({
        source: new Binding({ uri: card.type === 'Bloom' ? beastImageKey : cardImageKey }),
        style: {
          width: beastImageWidth,
          height: beastImageHeight,
          position: 'absolute',
          top: positions.beastImage.y,
          left: positions.beastImage.x,
        },
      }),

      // Layer 2: Base card frame (210x280) - ALL cards use BaseCard.png
      Image({
        source: new Binding({ uri: baseCardKey }),
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
        Image({
          source: new Binding({ uri: templateKey }),
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
        Image({
          source: new Binding({ uri: affinityKey }),
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
        Image({
          source: new Binding({ uri: expBarKey }),
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
      Text({
        text: new Binding(card.name || ''),
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
        Text({
          text: new Binding(String(card.cost)),
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
      ...(card.type === 'Bloom' && (card as any).baseAttack !== undefined ? [
        Text({
          text: new Binding(String((card as any).baseAttack)),
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

      ...(card.type === 'Bloom' && (card as any).baseHealth !== undefined ? [
        Text({
          text: new Binding(String((card as any).baseHealth)),
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
        Text({
          text: new Binding(`Level ${card.level}`),
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
        Text({
          text: new Binding(abilityText),
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
        View({
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: cardWidth,
            height: cardHeight,
            borderWidth: 4,
            borderColor: COLORS.success,
            borderRadius: 8,
            pointerEvents: 'none',
          },
        })
      ] : []),
    ],
  });
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
