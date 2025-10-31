/**
 * Player hand overlay - 5 card slots with scroll and toggle
 */

import type { PlayerHandProps } from './types';
import { standardCardDimensions, gameDimensions } from './types';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from '../../../gameManager';
import { BindingType, UIState } from '../../types/BindingManager';

export class PlayerHand {
  private ui: PlayerHandProps['ui'];
  private getBattleDisplayValue: () => any | null;
  private onAction?: (action: string) => void;
  private onShowHandChange?: (newValue: boolean) => void;
  private onScrollOffsetChange?: (newValue: number) => void;
  private onRenderNeeded?: () => void;
  private showPlayedCard?: (card: any, callback?: () => void) => void;

  // Combined binding to avoid creating multiple multi-binding derives
  private handDataBinding: any;

  constructor(props: PlayerHandProps) {
    this.ui = props.ui;
    this.getBattleDisplayValue = props.getBattleDisplayValue;
    this.onAction = props.onAction;
    this.onShowHandChange = props.onShowHandChange;
    this.onScrollOffsetChange = props.onScrollOffsetChange;
    this.onRenderNeeded = props.onRenderNeeded;
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
      // Layer 1: Card/Beast artwork image
      this.ui.Image({
        source: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          ( display: BattleDisplay | null, uiState: UIState) => {
            if (!display || !display.playerHand) return null;
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
        source: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          ( display: BattleDisplay | null, uiState: UIState) => {
            if (!display || !display.playerHand) return null;
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
        source: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          ( display: BattleDisplay | null, uiState: UIState) => {
            if (!display || !display.playerHand) return null;
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
        text: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          (display: BattleDisplay | null, uiState: UIState) => {
            if (!display || !display.playerHand) return '';
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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

      // Layer 6: Cost
      this.ui.Text({
        text: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          (display: BattleDisplay | null, uiState: UIState) => {
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
        text: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          (display: BattleDisplay | null, uiState: UIState) => {
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
        text: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          (display: BattleDisplay | null, uiState: UIState) => {
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
        text: this.ui.bindingManager.derive(
          [BindingType.BattleDisplay, BindingType.UIState],
          (display: BattleDisplay | null, uiState: UIState) => {
            const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
          display: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            (display: BattleDisplay | null, uiState: UIState) => {
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
                const scrollOffset = this.ui.bindingManager.getSnapshot(BindingType.UIState).battle?.handScrollOffset ?? 0;
                const actualIndex = scrollOffset * cardsPerPage + slotIndex;
                // Get current card state from cached value
                const display = this.getBattleDisplayValue();
                if (display && display.playerHand) {
                  const card = display.playerHand[actualIndex];
                  if (card) {

                    // Show card popup for magic/buff cards, then play
                    if (card.type === 'Magic' || card.type === 'Buff') {
                      this.showPlayedCard?.(card, () => {
                        this.onAction?.(`play-card-${actualIndex}`);
                      });
                    } else {
                      this.onAction?.(`play-card-${actualIndex}`);
                    }
                  } else {
                  }
                } else {
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
              backgroundColor: this.ui.bindingManager.derive(
                [BindingType.BattleDisplay, BindingType.UIState],
                (display: BattleDisplay | null, uiState: UIState) => {
                  const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
        top: this.ui.bindingManager.derive(
          [BindingType.UIState],
          (uiState: UIState) => {
            const showFull = uiState.battle?.showHand ?? false;
            return showFull ? (gameDimensions.panelHeight - 300) : 640;
          }
        ),
        width: overlayWidth,
        height: this.ui.bindingManager.derive(
          [BindingType.UIState],
          (uiState: UIState) => {
            const showFull = uiState.battle?.showHand ?? false;
            return showFull ? 300 : 80;
          }
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
            const snapshot = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const showFull = snapshot.battle?.showHand ?? false;
            const newShowHand = !showFull;
            this.ui.bindingManager.setBinding(BindingType.UIState, {
              ...snapshot,
              battle: {
                ...snapshot.battle,
                showHand: newShowHand,
              },
            });
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
            text: this.ui.bindingManager.derive(
              [BindingType.UIState],
              (uiState: UIState) => {
                const showFull = uiState.battle?.showHand ?? false;
                return showFull ? 'X' : '↑';
              }
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
            const snapshot = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const scrollOffset = snapshot.battle?.handScrollOffset ?? 0;
            const newOffset = Math.max(0, scrollOffset - 1);
            this.onScrollOffsetChange?.(newOffset);
          },
          disabled: this.ui.bindingManager.derive(
            [BindingType.UIState],
            (uiState: UIState) => {
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
              return scrollOffset <= 0;
            }
          ),
          style: {
            position: 'absolute',
            left: overlayWidth - 50,
            top: 10 + 50 + 10, // Below toggle button
            width: 60,
            height: 50,
            backgroundColor: this.ui.bindingManager.derive(
              [BindingType.UIState],
              (uiState: UIState) => {
                const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                return scrollOffset > 0 ? '#4a8ec2' : '#666';
              }
            ),
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: this.ui.bindingManager.derive(
              [BindingType.UIState],
              (uiState: UIState) => {
                const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                return scrollOffset > 0 ? 1 : 0.5;
              }
            ),
            display: this.ui.bindingManager.derive(
              [BindingType.UIState],
              (uiState: UIState) => {
                const showFull = uiState.battle?.showHand ?? false;
                return showFull ? 'flex' : 'none';
              }
            ),
          },
          children: this.ui.Text({
            text: 'UP',
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
            const snapshot = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const scrollOffset = snapshot.battle?.handScrollOffset ?? 0;
            const newOffset = scrollOffset + 1;
            this.onScrollOffsetChange?.(newOffset);
          },
          disabled: this.ui.bindingManager.derive(
            [BindingType.UIState, BindingType.BattleDisplay],
            (uiState: UIState, display: BattleDisplay | null) => {
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
              const totalPages = Math.ceil(display?.playerHand?.length ?? 0 / cardsPerPage);
              return scrollOffset >= totalPages - 1 || (display?.playerHand?.length ?? 0) <= cardsPerPage;
            }
          ),
          style: {
            position: 'absolute',
            left: overlayWidth - 50,
            top: 10 + 50 + 10 + 50 + 10, // Below up button
            width: 60,
            height: 50,
            backgroundColor: this.ui.bindingManager.derive(
              [BindingType.UIState, BindingType.BattleDisplay],
              (uiState: UIState, display: BattleDisplay | null) => {
                const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                const totalPages = Math.ceil(display?.playerHand?.length ?? 0 / cardsPerPage);
                return (scrollOffset < totalPages - 1 && (display?.playerHand?.length ?? 0) > cardsPerPage) ? '#4a8ec2' : '#666';
              }
            ),
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: this.ui.bindingManager.derive(
              [BindingType.UIState, BindingType.BattleDisplay],
              (uiState: UIState, display: BattleDisplay | null) => {
                const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                const totalPages = Math.ceil(display?.playerHand?.length ?? 0 / cardsPerPage);
                return (scrollOffset < totalPages - 1 && (display?.playerHand?.length ?? 0) > cardsPerPage) ? 1 : 0.5;
              }
            ),
            display: this.ui.bindingManager.derive(
              [BindingType.UIState],
              (uiState: UIState) => {
                const showFull = uiState.battle?.showHand ?? false;
                return showFull ? 'flex' : 'none';
              }
            ),
          },
          children: this.ui.Text({
            text: 'DOWN',
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
