/**
 * Beast field rendering - 3 slots per player
 */

import type { BattleComponentWithCallbacks } from './types';
import { standardCardDimensions, battleBoardAssetPositions } from './types';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from 'bloombeasts/gameManager';

export class BeastField {
  private ui: BattleComponentWithCallbacks['ui'];
  private battleDisplay: BattleComponentWithCallbacks['battleDisplay'];
  private onAction?: (action: string) => void;
  private targetingCardIndex: number | null;
  private targetingCard: any | null;
  private showPlayedCard?: (card: any, callback?: () => void) => void;

  constructor(props: BattleComponentWithCallbacks) {
    this.ui = props.ui;
    this.battleDisplay = props.battleDisplay;
    this.onAction = props.onAction;
    this.targetingCardIndex = props.targetingCardIndex;
    this.targetingCard = props.targetingCard;
    this.showPlayedCard = props.showPlayedCard;
  }

  /**
   * Create static beast card structure with reactive properties
   * All images, text, etc. use bindings instead of being dynamically created
   */
  private createBeastCardStructure(player: 'player' | 'opponent', slotIndex: number): UINodeType[] {
    const cardWidth = standardCardDimensions.width;
    const cardHeight = standardCardDimensions.height;
    const beastImageWidth = 185;
    const beastImageHeight = 185;

    const positions = {
      beastImage: { x: 12, y: 13 },
      cost: { x: 20, y: 10 },
      affinity: { x: 175, y: 7 },
      name: { x: 105, y: 13 },
      attack: { x: 20, y: 176 },
      health: { x: 188, y: 176 },
    };

    return [
      // Layer 1: Beast artwork image - reactive source
      this.ui.Image({
        source: this.ui.Binding.derive(
          [this.battleDisplay],
          (state: BattleDisplay | null) => {
            if (!state) return null;
            const field = player === 'player' ? state.playerField : state.opponentField;
            const beast = field?.[slotIndex];
            if (!beast) return null;
            const baseId = beast.id?.replace(/-\d+-\d+$/, '') || beast.name.toLowerCase().replace(/\s+/g, '-');
            return this.ui.assetIdToImageSource?.(baseId) || null;
          }
        ),
        style: {
          width: beastImageWidth,
          height: beastImageHeight,
          position: 'absolute',
          top: positions.beastImage.y,
          left: positions.beastImage.x,
        },
      }),

      // Layer 2: Base card frame
      this.ui.Image({
        source: this.ui.assetIdToImageSource?.('base-card') || null,
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'absolute',
          top: 0,
          left: 0,
        },
      }),

      // Layer 3: Affinity icon - reactive source
      this.ui.Image({
        source: this.ui.Binding.derive(
          [this.battleDisplay],
          (state: BattleDisplay | null) => {
            if (!state) return null;
            const field = player === 'player' ? state.playerField : state.opponentField;
            const beast = field?.[slotIndex];
            if (!beast || !beast.affinity) return null;
            return this.ui.assetIdToImageSource?.(`${beast.affinity.toLowerCase()}-icon`) || null;
          }
        ),
        style: {
          width: 30,
          height: 30,
          position: 'absolute',
          top: positions.affinity.y,
          left: positions.affinity.x,
        },
      }),

      // Layer 4: Card name - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay],
          (state: BattleDisplay | null) => {
            if (!state) return '';
            const field = player === 'player' ? state.playerField : state.opponentField;
            const beast = field?.[slotIndex];
            return beast?.name || '';
          }
        ),
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

      // Layer 5: Cost - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay],
          (state: BattleDisplay | null) => {
            if (!state) return '';
            const field = player === 'player' ? state.playerField : state.opponentField;
            const beast = field?.[slotIndex];
            return beast && beast.cost !== undefined ? String(beast.cost) : '';
          }
        ),
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

      // Layer 6: Attack - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay],
          (state: BattleDisplay | null) => {
            if (!state) return '';
            const field = player === 'player' ? state.playerField : state.opponentField;
            const beast = field?.[slotIndex];
            return beast ? String(beast.currentAttack ?? beast.baseAttack ?? 0) : '';
          }
        ),
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

      // Layer 7: Health - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay],
          (state: BattleDisplay | null) => {
            if (!state) return '';
            const field = player === 'player' ? state.playerField : state.opponentField;
            const beast = field?.[slotIndex];
            return beast ? String(beast.currentHealth ?? beast.baseHealth ?? 0) : '';
          }
        ),
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
    ];
  }

  /**
   * Create beast field for a player - REACTIVE
   * Creates 3 slots, bindings determine what's shown
   */
  createBeastField(player: 'player' | 'opponent'): UINodeType[] {
    const positions = player === 'player'
      ? battleBoardAssetPositions.playerTwo
      : battleBoardAssetPositions.playerOne;
    const slots = [positions.beastOne, positions.beastTwo, positions.beastThree];

    // Create 3 beast slots
    return slots.map((pos, index) => {
      // All bindings must derive from this.battleDisplay, not from other derived bindings
      return this.ui.View({
        style: {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: standardCardDimensions.width,
          height: standardCardDimensions.height,
          // Hide slot if no beast - derive directly from battleDisplay
          display: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => {
              if (!state) return 'none';
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[index];
              return beast ? 'flex' : 'none';
            }
          ),
        },
        children: [
          // Beast card - static structure with reactive properties
          this.ui.Pressable({
            onClick: () => {
              // Check if we're in targeting mode
              if (this.targetingCardIndex !== null && player === 'opponent') {
                const cardIndex = this.targetingCardIndex;
                const card = this.targetingCard;

                if (card && (card.type === 'Magic' || card.type === 'Buff')) {
                  this.showPlayedCard?.(card, () => {
                    this.onAction?.(`play-card-${cardIndex}-target-${index}`);
                  });
                } else {
                  this.onAction?.(`play-card-${cardIndex}-target-${index}`);
                }
              } else {
                // Normal behavior (view card or select for attack)
                this.onAction?.(`view-field-card-${player}-${index}`);
              }
            },
            style: {
              width: standardCardDimensions.width,
              height: standardCardDimensions.height,
              position: 'relative',
            },
            children: this.createBeastCardStructure(player, index),
          }),

          // Targeting highlight (green for valid targets)
          this.ui.View({
            style: {
              position: 'absolute',
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              borderWidth: 3,
              borderColor: '#00ff00',
              borderRadius: 8,
              display: player === 'opponent' && this.targetingCardIndex !== null ? 'flex' : 'none',
            },
          }),

          // Selection highlight - derive directly from battleDisplay
          this.ui.View({
            style: {
              position: 'absolute',
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              borderWidth: 5,
              borderColor: '#FFD700',
              borderRadius: 12,
              display: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay | null) => {
                  const isSelected = player === 'player' && state?.selectedBeastIndex === index;
                  return isSelected ? 'flex' : 'none';
                }
              ),
            },
          }),

          // Attack animation overlay - derive directly from battleDisplay
          this.ui.View({
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay | null) => {
                  const isAttacking = state?.attackAnimation?.attackerPlayer === player &&
                                     state?.attackAnimation?.attackerIndex === index;
                  const isTarget = state?.attackAnimation?.targetPlayer === player &&
                                  state?.attackAnimation?.targetIndex === index;
                  if (isAttacking) return 'rgba(0, 255, 0, 0.4)';
                  if (isTarget) return 'rgba(255, 0, 0, 0.4)';
                  return 'transparent';
                }
              ),
              borderRadius: 12,
              display: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay | null) => {
                  const isAttacking = state?.attackAnimation?.attackerPlayer === player &&
                                     state?.attackAnimation?.attackerIndex === index;
                  const isTarget = state?.attackAnimation?.targetPlayer === player &&
                                  state?.attackAnimation?.targetIndex === index;
                  return (isAttacking || isTarget) ? 'flex' : 'none';
                }
              ),
            },
          }),

          // Action icons overlay wrapper - always exists, visibility controlled by display
          this.ui.View({
            style: {
              position: 'absolute',
              left: 17,
              top: 44,
              width: 26,
              height: 26,
              // Hide when no beast or beast has summoning sickness
              display: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay | null) => {
                  if (!state) return 'none';
                  const field = player === 'player' ? state.playerField : state.opponentField;
                  const beast = field?.[index];
                  if (!beast || beast.summoningSickness) return 'none';
                  return 'flex';
                }
              ),
            },
            children: this.ui.Image({
              source: this.ui.assetIdToImageSource?.('icon-attack') || null,
              style: { width: 26, height: 26 },
            }),
          }),
        ],
      });
    });
  }
}
