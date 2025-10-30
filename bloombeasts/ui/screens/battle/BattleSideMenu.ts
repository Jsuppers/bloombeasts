/**
 * Battle side menu - Turn counter, end turn button, forfeit
 */

import type { BattleSideMenuProps } from './types';
import { sideMenuPositions } from '../../constants/positions';
import { sideMenuButtonDimensions } from '../../constants/dimensions';
import { DIMENSIONS } from '../../styles/dimensions';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from 'bloombeasts/gameManager';

export class BattleSideMenu {
  private ui: BattleSideMenuProps['ui'];
  private battleDisplay: BattleSideMenuProps['battleDisplay'];
  private endTurnButtonText: BattleSideMenuProps['endTurnButtonText'];
  private isPlayerTurnValue: boolean;
  private onAction?: (action: string) => void;
  private onStopTurnTimer?: () => void;

  constructor(props: BattleSideMenuProps) {
    this.ui = props.ui;
    this.battleDisplay = props.battleDisplay;
    this.endTurnButtonText = props.endTurnButtonText;
    this.isPlayerTurnValue = props.isPlayerTurnValue;
    this.onAction = props.onAction;
    this.onStopTurnTimer = props.onStopTurnTimer;
  }

  /**
   * Create battle-specific side menu - Fully reactive
   */
  createBattleSideMenu(): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        left: sideMenuPositions.x,
        top: sideMenuPositions.y,
        width: 127,
        height: 465,
      },
      children: [
        // Side menu background
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('side-menu') : null
          ),
          style: {
            position: 'absolute',
            width: 127,
            height: 465,
          },
        }),

        // Forfeit button (at header position)
        this.ui.Pressable({
          onClick: () => {
            console.log('[BattleSideMenu] Forfeit button clicked');
            this.onAction?.('btn-forfeit');
          },
          style: {
            position: 'absolute',
            left: sideMenuPositions.headerStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.headerStartPosition.y - sideMenuPositions.y,
            width: sideMenuButtonDimensions.width,
            height: sideMenuButtonDimensions.height,
          },
          children: [
            // Button background image
            this.ui.Image({
              source: this.ui.Binding.derive(
                [this.ui.assetsLoadedBinding],
                (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('standard-button') : null
              ),
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
              },
            }),
            // Button text centered over image
            this.ui.View({
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: 'Forfeit',
                style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
            }),
          ],
        }),

        // Battle info text
        this.ui.View({
          style: {
            position: 'absolute',
            left: sideMenuPositions.textStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.textStartPosition.y - sideMenuPositions.y,
          },
          children: [
            this.ui.Text({
              text: new this.ui.Binding('Battle'),
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `Turn ${state.currentTurn}` : 'Turn 1'
              ),
              style: {
                fontSize: 18,
                color: '#fff',
                marginBottom: 5,
              },
            }),
            // Deathmatch warning (reactive) - always rendered, conditionally visible
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay | null) => {
                  if (!state || state.currentTurn < 30) return '';
                  const deathmatchDamage = Math.floor((state.currentTurn - 30) / 5) + 1;
                  return `Deathmatch! -${deathmatchDamage} HP`;
                }
              ),
              style: {
                fontSize: 16,
                color: '#ff6b6b',
                fontWeight: 'bold',
                display: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay | null) => {
                    return (state && state.currentTurn >= 30) ? 'flex' : 'none';
                  }
                ),
              },
            }),
          ],
        }),

        // End Turn button with timer - uses derived bindings for reactive updates
        this.ui.Pressable({
          onClick: () => {
            const currentIsPlayerTurn = this.isPlayerTurnValue;
            console.log('[BattleSideMenu] End Turn button clicked, isPlayerTurn:', currentIsPlayerTurn);
            if (currentIsPlayerTurn) {
              this.onStopTurnTimer?.();
              console.log('[BattleSideMenu] Calling onAction with end-turn');
              this.onAction?.('end-turn');
            } else {
              console.log('[BattleSideMenu] End Turn clicked but not player turn');
            }
          },
          disabled: this.ui.Binding.derive([this.battleDisplay], (state: BattleDisplay) => state?.turnPlayer !== 'player'),
          style: {
            position: 'absolute',
            left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y,
            width: sideMenuButtonDimensions.width,
            height: sideMenuButtonDimensions.height,
            opacity: this.ui.Binding.derive([this.battleDisplay], (state: BattleDisplay) => state?.turnPlayer === 'player' ? 1 : 0.5),
          },
          children: [
            // Button background image - green when player turn, standard when opponent turn
            this.ui.Image({
              source: this.ui.Binding.derive(
                [this.ui.assetsLoadedBinding, this.battleDisplay],
                (assetsLoaded: boolean, state: BattleDisplay) => {
                  if (!assetsLoaded) return null;
                  return this.ui.assetIdToImageSource?.(state?.turnPlayer === 'player' ? 'green-button' : 'standard-button') ?? null;
                }
              ),
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
              },
            }),
            // Button text centered over image
            this.ui.View({
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: this.endTurnButtonText,
                style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
            }),
          ],
        }),
      ],
    });
  }
}
