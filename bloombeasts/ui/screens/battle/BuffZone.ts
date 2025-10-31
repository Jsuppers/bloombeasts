/**
 * Buff zone rendering - 2 slots per player
 */

import { BattleDisplay } from '../../../gameManager';
import type { BattleComponentWithCallbacks } from './types';
import { buffCardDimensions, battleBoardAssetPositions } from './types';
import { UINodeType } from '../ScreenUtils';
import { BindingType } from '../../types/BindingManager';

export class BuffZone {
  private ui: BattleComponentWithCallbacks['ui'];
  private onCardDetailSelected?: (card: any) => void;

  constructor(props: BattleComponentWithCallbacks) {
    this.ui = props.ui;
    this.onCardDetailSelected = props.onCardDetailSelected;
  }

  /**
   * Create buff zone for a player - REACTIVE
   * Creates 2 slots, bindings determine what's shown
   */
  createBuffZone(player: 'player' | 'opponent'): UINodeType[] {
    const positions = player === 'player'
      ? battleBoardAssetPositions.playerTwo
      : battleBoardAssetPositions.playerOne;
    const buffSlots = [positions.buffOne, positions.buffTwo];

    // Create 2 buff slots
    return buffSlots.map((pos, index) => {
      // Get buff card template source directly
      const buffCardSource = this.ui.assetIdToImageSource?.('buff-card-playboard') || null;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: buffCardDimensions.width,
          height: buffCardDimensions.height,
          // Hide slot if no buff - derive from battleDisplay
          display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
            if (!state) return 'none';
            const buffZone = player === 'player' ? state.playerBuffZone : state.opponentBuffZone;
            const buff = buffZone?.[index];
            return buff ? 'flex' : 'none';
          }),
        },
        children: [
          // Clickable wrapper for buff card
          this.ui.Pressable({
            onClick: () => {
              console.log(`[BuffZone] Buff card clicked: ${player}-${index}, showing detail`);
              // Get current buff at click time
              const state = this.ui.bindingManager.getSnapshot(BindingType.BattleDisplay);
              if (state && typeof state === 'object' && 'playerBuffZone' in state) {
                const buffZone = player === 'player' ? (state as any).playerBuffZone : (state as any).opponentBuffZone;
                const buff = buffZone?.[index];
                if (buff) {
                  this.onCardDetailSelected?.(buff);
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
              // Buff card playboard template (face-up)
              this.ui.Image({
                source: buffCardSource,
                style: {
                  width: buffCardDimensions.width,
                  height: buffCardDimensions.height,
                },
              }),

              // Buff card artwork image wrapper - always exists, image source is reactive
              this.ui.View({
                style: {
                  position: 'absolute',
                  top: (buffCardDimensions.height - 100) / 2,
                  left: (buffCardDimensions.width - 100) / 2,
                  width: 100,
                  height: 100,
                },
                children: this.ui.Image({
                  source: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
                    if (!state) return null;
                    const buffZone = player === 'player' ? state?.playerBuffZone : state?.opponentBuffZone;
                    const buff = buffZone?.[index];
                    if (!buff) return null;
                    return this.ui.assetIdToImageSource?.(buff.id?.replace(/-\d+-\d+$/, '') || buff.name.toLowerCase().replace(/\s+/g, '-'));
                  }),
                  style: {
                    width: 100,
                    height: 100,
                  },
                }),
              }),

              // Golden glow effect
              this.ui.View({
                style: {
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  right: -3,
                  bottom: -3,
                  borderWidth: 3,
                  borderColor: '#FFD700',
                  borderRadius: 8,
                  shadowColor: '#FFD700',
                  shadowRadius: 8,
                },
              }),
            ],
          }),
        ],
      });
    });
  }
}
