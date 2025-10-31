/**
 * Trap zone rendering - 3 slots per player
 */

import { BindingType } from '../../types/BindingManager';
import { BattleDisplay } from '../../../gameManager';
import { UINodeType } from '../ScreenUtils';
import type { BattleComponentWithCallbacks } from './types';
import { trapCardDimensions, battleBoardAssetPositions } from './types';

export class TrapZone {
  private ui: BattleComponentWithCallbacks['ui'];
  private onCardDetailSelected?: (card: any) => void;

  constructor(props: BattleComponentWithCallbacks) {
    this.ui = props.ui;
    this.onCardDetailSelected = props.onCardDetailSelected;
  }

  /**
   * Create trap zone for a player - REACTIVE
   * Creates 3 slots, bindings determine what's shown
   */
  createTrapZone(player: 'player' | 'opponent'): UINodeType[] {
    const positions = player === 'player'
      ? battleBoardAssetPositions.playerTwo
      : battleBoardAssetPositions.playerOne;
    const trapSlots = [positions.trapOne, positions.trapTwo, positions.trapThree];

    // Create 3 trap slots
    return trapSlots.map((pos, index) => {
      // Get trap card image source directly
      const trapCardSource = this.ui.assetIdToImageSource?.('trap-card-playboard') || null;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: trapCardDimensions.width,
          height: trapCardDimensions.height,
          // Hide slot if no trap - derive from battleDisplay
          display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
            if (!state) return 'none';
            const trapZone = player === 'player' ? state.playerTrapZone : state.opponentTrapZone;
            const trap = trapZone?.[index];
            return trap ? 'flex' : 'none';
          }),
        },
        children: [
          // Clickable wrapper for trap card
          this.ui.Pressable({
            onClick: () => {
              // Only allow player to view their own trap cards
              if (player === 'player') {
                // Get current trap at click time
                const state = this.ui.bindingManager.getSnapshot(BindingType.BattleDisplay) as BattleDisplay | null;
                if (state) {
                  const trapZone = state?.playerTrapZone;
                  const trap = trapZone?.[index];
                  if (trap) {
                    this.onCardDetailSelected?.(trap);
                  }
                }
              }
            },
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            children: [
              // Trap card playboard image (face-down)
              this.ui.Image({
                source: trapCardSource,
                style: {
                  width: trapCardDimensions.width,
                  height: trapCardDimensions.height,
                },
              }),
            ],
          }),
        ],
      });
    });
  }
}
