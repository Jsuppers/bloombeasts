/**
 * Habitat zone rendering (center of board)
 */

import { BattleDisplay } from '../../../gameManager';
import { UINodeType } from '../ScreenUtils';
import type { BattleComponentWithCallbacks } from './types';
import { habitatShiftCardDimensions, battleBoardAssetPositions } from './types';

export class HabitatZone {
  private ui: BattleComponentWithCallbacks['ui'];
  private battleDisplay: BattleComponentWithCallbacks['battleDisplay'];
  private onCardDetailSelected?: (card: any) => void;

  constructor(props: BattleComponentWithCallbacks) {
    this.ui = props.ui;
    this.battleDisplay = props.battleDisplay;
    this.onCardDetailSelected = props.onCardDetailSelected;
  }

  /**
   * Create habitat zone - REACTIVE
   * Derives habitat from battleDisplay binding
   */
  createHabitatZone(): UINodeType {
    const pos = battleBoardAssetPositions.habitatZone;

    return this.ui.View({
      style: {
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: habitatShiftCardDimensions.width,
        height: habitatShiftCardDimensions.height,
        // Hide if no habitat
        display: this.ui.Binding.derive(
          [this.battleDisplay],
          (state: BattleDisplay | null) => state?.habitatZone ? 'flex' : 'none'
        ),
      },
      children: [
        // Clickable wrapper for entire habitat card
        this.ui.Pressable({
          onClick: () => {
            console.log('[HabitatZone] Habitat card clicked, showing detail');
            // Get current habitat at click time
            const state = this.battleDisplay;
            if (state && typeof state === 'object' && 'habitatZone' in state) {
              const habitat = (state as any).habitatZone;
              if (habitat) {
                const habitatWithType = { ...habitat, type: 'Habitat' };
                this.onCardDetailSelected?.(habitatWithType);
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
            // Habitat artwork image wrapper - always exists, image source is reactive
            this.ui.View({
              style: {
                position: 'absolute',
                top: (habitatShiftCardDimensions.height - 70) / 2,
                left: (habitatShiftCardDimensions.width - 70) / 2,
                width: 70,
                height: 70,
              },
              children: this.ui.Image({
                source: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay | null) => {
                    if (!state?.habitatZone) return null;
                    const habitat = state.habitatZone;
                    return this.ui.assetIdToImageSource?.(habitat.id?.replace(/-\d+-\d+$/, '') || habitat.name.toLowerCase().replace(/\s+/g, '-'));
                  }
                ),
                style: {
                  width: 70,
                  height: 70,
                },
              }),
            }),

            // Green glow effect
            this.ui.View({
              style: {
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderWidth: 4,
                borderColor: '#4caf50',
                borderRadius: 8,
                shadowColor: '#4caf50',
                shadowRadius: 10,
              },
            }),

            // TODO: Counter badges - need to implement without Binding.derive in children
            // For now, counter badges are disabled until we implement proper reactive rendering
          ],
        }),
      ],
    });
  }

  /**
   * Create counter badges for habitat
   */
  private createCounterBadges(counters: any[], basePos: { x: number; y: number }): UINodeType {
    const counterMap = new Map<string, number>();
    counters.forEach((counter: any) => {
      const current = counterMap.get(counter.type) || 0;
      counterMap.set(counter.type, current + counter.amount);
    });

    const counterConfigs: Record<string, { emoji: string; color: string }> = {
      'Spore': { emoji: '🍄', color: '#51cf66' },
    };

    const badges = Array.from(counterMap.entries()).map(([type, amount], index) => {
      if (amount <= 0) return null;

      const config = counterConfigs[type] || { emoji: '●', color: '#868e96' };
      const badgeSize = 28;
      const badgeSpacing = 32;

      return this.ui.View({
        style: {
          position: 'absolute',
          right: 10 + (index * badgeSpacing),
          top: 5,
          width: badgeSize,
          height: badgeSize,
          backgroundColor: config.color,
          borderRadius: badgeSize / 2,
          borderWidth: 2,
          borderColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        },
        children: this.ui.Text({
          text: `${config.emoji} ${amount}`,
          style: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
          },
        }),
      });
    }).filter(Boolean);

    return this.ui.View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      children: badges,
    });
  }
}
