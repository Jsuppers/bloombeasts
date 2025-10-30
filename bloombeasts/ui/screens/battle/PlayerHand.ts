/**
 * Player hand overlay - 5 card slots with scroll and toggle
 */

import type { PlayerHandProps } from './types';
import { standardCardDimensions, gameDimensions } from './types';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from 'bloombeasts/gameManager';

export class PlayerHand {
  private ui: PlayerHandProps['ui'];
  private battleDisplay: PlayerHandProps['battleDisplay'];
  private showHand: PlayerHandProps['showHand'];
  private handScrollOffset: PlayerHandProps['handScrollOffset'];
  private showHandValue: boolean;
  private handScrollOffsetValue: number;
  private targetingCardIndex: number | null;
  private targetingCard: any | null;
  private onAction?: (action: string) => void;
  private onShowHandChange?: (newValue: boolean) => void;
  private onScrollOffsetChange?: (newValue: number) => void;
  private onRenderNeeded?: () => void;
  private onEnterTargetingMode?: (cardIndex: number, card: any) => void;
  private showPlayedCard?: (card: any, callback?: () => void) => void;

  constructor(props: PlayerHandProps) {
    this.ui = props.ui;
    this.battleDisplay = props.battleDisplay;
    this.showHand = props.showHand;
    this.handScrollOffset = props.handScrollOffset;
    this.showHandValue = props.showHandValue;
    this.handScrollOffsetValue = props.handScrollOffsetValue;
    this.targetingCardIndex = props.targetingCardIndex;
    this.targetingCard = props.targetingCard;
    this.onAction = props.onAction;
    this.onShowHandChange = props.onShowHandChange;
    this.onScrollOffsetChange = props.onScrollOffsetChange;
    this.onRenderNeeded = props.onRenderNeeded;
    this.onEnterTargetingMode = props.onEnterTargetingMode;
    this.showPlayedCard = props.showPlayedCard;
  }

  /**
   * Create static card structure with reactive properties for hand slot
   * Handles all card types: Bloom, Magic, Trap, Buff, Habitat
   */
  private createHandCardStructure(slotIndex: number, cardsPerPage: number): UINodeType[] {
    const cardWidth = standardCardDimensions.width;
    const cardHeight = standardCardDimensions.height;
    const beastImageWidth = 185;
    const beastImageHeight = 185;

    const positions = {
      beastImage: { x: 12, y: 13 },
      cost: { x: 20, y: 10 },
      affinity: { x: 175, y: 7 },
      name: { x: 105, y: 13 },
      ability: { x: 21, y: 212 },
      attack: { x: 20, y: 176 },
      health: { x: 188, y: 176 },
    };

    return [
      // Layer 1: Card/Beast artwork image - reactive source
      this.ui.Image({
        source: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return null;
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            if (!card) return null;
            const baseId = card.id?.replace(/-\d+-\d+$/, '') || card.name.toLowerCase().replace(/\s+/g, '-');
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

      // Layer 3: Type-specific template overlay - reactive source
      this.ui.Image({
        source: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return null;
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            if (!card || card.type === 'Bloom') return null;

            let templateKey = '';
            if (card.type === 'Habitat' && card.affinity) {
              templateKey = `${card.affinity.toLowerCase()}-habitat`;
            } else {
              templateKey = `${card.type.toLowerCase()}-card`;
            }
            return this.ui.assetIdToImageSource?.(templateKey) || null;
          }
        ),
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'absolute',
          top: 0,
          left: 0,
        },
      }),

      // Layer 4: Affinity icon (for Bloom cards) - reactive source
      this.ui.Image({
        source: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return null;
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            if (!card || card.type !== 'Bloom' || !card.affinity) return null;
            return this.ui.assetIdToImageSource?.(`${card.affinity.toLowerCase()}-icon`) || null;
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

      // Layer 5: Card name - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return '';
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            return card?.name || '';
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

      // Layer 6: Cost - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return '';
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            return card && card.cost !== undefined ? String(card.cost) : '';
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

      // Layer 7: Attack (for Bloom cards) - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return '';
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            if (!card || card.type !== 'Bloom') return '';
            return String((card as any).currentAttack ?? (card as any).baseAttack ?? 0);
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

      // Layer 8: Health (for Bloom cards) - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return '';
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            if (!card || card.type !== 'Bloom') return '';
            return String((card as any).currentHealth ?? (card as any).baseHealth ?? 0);
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

      // Layer 9: Ability text (for non-Bloom cards) - reactive text
      this.ui.Text({
        text: this.ui.Binding.derive(
          [this.battleDisplay, this.handScrollOffset],
          (display: BattleDisplay | null, scrollOffset: number) => {
            if (!display || !display.playerHand) return '';
            const actualIndex = scrollOffset * cardsPerPage + slotIndex;
            const card = display.playerHand[actualIndex];
            if (!card || card.type === 'Bloom') return '';
            // For now, show basic ability text - could enhance with description generator
            return card.abilities?.[0]?.description || '';
          }
        ),
        numberOfLines: 3,
        style: {
          position: 'absolute',
          top: positions.ability.y,
          left: positions.ability.x,
          width: 168,
          fontSize: 10,
          color: '#fff',
          textAlign: 'left',
        },
      }),
    ];
  }

  /**
   * Create player hand overlay - REACTIVE version using bindings
   * Creates all slots upfront, uses bindings to show/hide cards
   */
  createPlayerHand(): UINodeType {
    // Hand overlay dimensions
    const cardWidth = standardCardDimensions.width;  // 210
    const cardHeight = standardCardDimensions.height; // 280
    const cardsPerRow = 5;
    const rowsPerPage = 1;
    const spacing = 10;
    const startX = 50;
    const overlayWidth = 1210;
    const startY = 10;

    const cardsPerPage = cardsPerRow * rowsPerPage;

    // Create card slots (5 slots total for one row)
    const cardSlots = Array.from({ length: cardsPerPage }, (_, slotIndex) => {
      const col = slotIndex % cardsPerRow;
      const row = Math.floor(slotIndex / cardsPerRow);
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      return this.ui.View({
        style: {
          position: 'absolute',
          left: x,
          top: y,
          width: cardWidth,
          height: cardHeight,
          // Hide slot if no card - derive directly from battleDisplay and handScrollOffset
          display: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return 'none';
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              return card ? 'flex' : 'none';
            }
          ),
        },
        children: [
          // Card component wrapper - always exists, card content is reactive
          this.ui.View({
            style: {
              width: cardWidth,
              height: cardHeight,
            },
            children: this.ui.Pressable({
              onClick: () => {
                const actualIndex = this.handScrollOffsetValue * cardsPerPage + slotIndex;
                // Get current card state
                const display = this.battleDisplay;
                if (display && typeof display === 'object' && 'playerHand' in display) {
                  const card = (display as any).playerHand?.[actualIndex];
                  if (card) {
                    console.log(`[PlayerHand] Card clicked: ${actualIndex}, card: ${card.name}`);

                    // Check if card requires a target
                    if (card.targetRequired) {
                      console.log('[PlayerHand] Entering targeting mode for card:', card.name);
                      this.onEnterTargetingMode?.(actualIndex, card);
                    } else {
                      // Show card popup for magic/buff cards, then play
                      if (card.type === 'Magic' || card.type === 'Buff') {
                        this.showPlayedCard?.(card, () => {
                          this.onAction?.(`play-card-${actualIndex}`);
                        });
                      } else {
                        this.onAction?.(`play-card-${actualIndex}`);
                      }
                    }
                  }
                }
              },
              style: {
                width: cardWidth,
                height: cardHeight,
                position: 'relative',
              },
              children: this.createHandCardStructure(slotIndex, cardsPerPage),
            }),
          }),

          // Dim overlay if not affordable - derive directly from battleDisplay and handScrollOffset
          this.ui.View({
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: this.ui.Binding.derive(
                [this.battleDisplay, this.handScrollOffset],
                (display: BattleDisplay | null, scrollOffset: number) => {
                  if (!display || !display.playerHand) return 'transparent';
                  const actualIndex = scrollOffset * cardsPerPage + slotIndex;
                  const card = display.playerHand[actualIndex];
                  if (!card) return 'transparent';
                  const canAfford = card.cost <= display.playerNectar;
                  return canAfford ? 'transparent' : 'rgba(0, 0, 0, 0.5)';
                }
              ),
            },
          }),
        ].filter(Boolean),
      });
    });

    return this.ui.View({
      style: {
        position: 'absolute',
        left: 40,
        top: this.ui.Binding.derive(
          [this.showHand],
          (showFull: boolean) => gameDimensions.panelHeight - (showFull ? 300 : 60)
        ),
        width: overlayWidth,
        height: this.ui.Binding.derive(
          [this.showHand],
          (showFull: boolean) => showFull ? 300 : 60
        ),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 3,
        borderColor: '#4a8ec2',
      },
      children: [
        // Render all card slots (they show/hide based on bindings)
        ...cardSlots,

        // Toggle button
        this.ui.Pressable({
          onClick: () => {
            const newShowHand = !this.showHandValue;
            this.onShowHandChange?.(newShowHand);
            this.onAction?.('toggle-hand');
          },
          style: {
            position: 'absolute',
            left: overlayWidth - 50,
            top: 10,
            width: 60,
            height: 50,
            backgroundColor: '#4a8ec2',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: this.ui.Text({
            text: this.ui.Binding.derive(
              [this.showHand],
              (showFull: boolean) => showFull ? 'X' : '↑'
            ),
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
            },
          }),
        }),

        // Scroll buttons (show/hide based on showHand binding)
        // Up button (positioned below toggle button)
        this.ui.Pressable({
          onClick: () => {
            const newOffset = Math.max(0, this.handScrollOffsetValue - 1);
            this.onScrollOffsetChange?.(newOffset);
          },
          disabled: this.ui.Binding.derive(
            [this.handScrollOffset],
            (offset: number) => offset <= 0
          ),
          style: {
            position: 'absolute',
            left: overlayWidth - 50,
            top: 10 + 50 + 10, // Below toggle button
            width: 60,
            height: 50,
            backgroundColor: this.ui.Binding.derive(
              [this.handScrollOffset],
              (offset: number) => offset > 0 ? '#4a8ec2' : '#666'
            ),
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: this.ui.Binding.derive(
              [this.handScrollOffset],
              (offset: number) => offset > 0 ? 1 : 0.5
            ),
            display: this.ui.Binding.derive(
              [this.showHand],
              (showFull: boolean) => showFull ? 'flex' : 'none'
            ),
          },
          children: this.ui.Text({
            text: new this.ui.Binding('⬆'),
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
            },
          }),
        }),

        // Down button (positioned below up button)
        this.ui.Pressable({
          onClick: () => {
            this.onScrollOffsetChange?.(this.handScrollOffsetValue + 1);
          },
          disabled: this.ui.Binding.derive(
            [this.handScrollOffset, this.battleDisplay],
            (offset: number, state: BattleDisplay | null) => {
              if (!state || !state.playerHand) return true;
              const totalPages = Math.ceil(state.playerHand.length / cardsPerPage);
              return offset >= totalPages - 1 || state.playerHand.length <= cardsPerPage;
            }
          ),
          style: {
            position: 'absolute',
            left: overlayWidth - 50,
            top: 10 + 50 + 10 + 50 + 10, // Below up button
            width: 60,
            height: 50,
            backgroundColor: this.ui.Binding.derive(
              [this.handScrollOffset, this.battleDisplay],
              (offset: number, state: BattleDisplay | null) => {
                if (!state || !state.playerHand) return '#666';
                const totalPages = Math.ceil(state.playerHand.length / cardsPerPage);
                return (offset < totalPages - 1 && state.playerHand.length > cardsPerPage) ? '#4a8ec2' : '#666';
              }
            ),
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: this.ui.Binding.derive(
              [this.handScrollOffset, this.battleDisplay],
              (offset: number, state: BattleDisplay | null) => {
                if (!state || !state.playerHand) return 0.5;
                const totalPages = Math.ceil(state.playerHand.length / cardsPerPage);
                return (offset < totalPages - 1 && state.playerHand.length > cardsPerPage) ? 1 : 0.5;
              }
            ),
            display: this.ui.Binding.derive(
              [this.showHand],
              (showFull: boolean) => showFull ? 'flex' : 'none'
            ),
          },
          children: this.ui.Text({
            text: new this.ui.Binding('↓'),
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
            },
          }),
        }),
      ].filter(Boolean),
    });
  }
}
