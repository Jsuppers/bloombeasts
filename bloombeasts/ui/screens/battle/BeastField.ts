/**
 * Beast field rendering - 3 slots per player
 */

import type { BattleComponentWithCallbacks } from './types';
import { standardCardDimensions, battleBoardAssetPositions } from './types';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from '../../../gameManager';
import { BindingType } from '../../types/BindingManager';
import { createReactiveCardComponent } from '../common/CardRenderer';

export class BeastField {
  private ui: BattleComponentWithCallbacks['ui'];
  private onAction?: (action: string) => void;
  private showPlayedCard?: (card: any, callback?: () => void) => void;

  constructor(props: BattleComponentWithCallbacks) {
    this.ui = props.ui;
    this.onAction = props.onAction;
    this.showPlayedCard = props.showPlayedCard;
  }

  /**
   * Create static beast card structure with reactive properties
   * Now uses the shared reactive card component
   */
  private createBeastCardStructure(player: 'player' | 'opponent', slotIndex: number): UINodeType {
    return createReactiveCardComponent(this.ui, {
      mode: 'battleBeast',
      player,
      slotIndex,
      showDeckIndicator: false,
    });
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
          display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
              // View card details only (selection removed)
              this.onAction?.(`view-field-card-${player}-${index}`);
            },
            style: {
              width: standardCardDimensions.width,
              height: standardCardDimensions.height,
              position: 'relative',
            },
            children: this.createBeastCardStructure(player, index),
          }),

          // Attack animation overlay - derive directly from battleDisplay
          this.ui.View({
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
              display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
              display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
