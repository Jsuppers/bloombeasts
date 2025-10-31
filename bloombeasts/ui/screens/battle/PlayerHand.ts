/**
 * Player hand overlay - 5 card slots with scroll and toggle
 */

import type { PlayerHandProps } from './types';
import { standardCardDimensions, gameDimensions } from './types';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from '../../../gameManager';
import { BindingType, UIState } from '../../types/BindingManager';
import { createReactiveCardComponent } from '../common/CardRenderer';

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
   * Now uses the shared reactive card component
   */
  private createHandCardStructure(slotIndex: number, cardsPerPage: number): UINodeType {
    return createReactiveCardComponent(this.ui, {
      mode: 'battleHand',
      slotIndex,
      cardsPerPage,
      showDeckIndicator: false,
    });
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
        left: (gameDimensions.panelWidth - overlayWidth) / 2,
        bottom: 0,
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
        // Background blocker to prevent clicks passing through
        this.ui.Pressable({
          onClick: () => {
            // Consume clicks to prevent them from passing through
          },
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          },
          children: [],
        }),

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
            this.onRenderNeeded?.();
            this.onShowHandChange?.(newShowHand);
            this.onAction?.('toggle-hand');
          },
          style: {
            position: 'absolute',
            left: overlayWidth - 80,
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
            left: overlayWidth - 80,
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
            text: '⬆',
            style: {
              fontSize: 32,
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
            left: overlayWidth - 80,
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
            text: '⬇',
            style: {
              fontSize: 32,
              color: '#fff',
            },
          }),
        }),
      ].filter(Boolean),
    });
  }
}
