/**
 * Battle side menu - Turn counter, end turn button, forfeit
 */

import type { BattleSideMenuProps } from './types';
import { sideMenuPositions } from '../../constants/positions';
import { sideMenuButtonDimensions } from '../../constants/dimensions';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from '../../../gameManager';
import { canAttack } from '../../../engine/utils/combatHelpers';
import { createButton } from '../../common/Button';
import { BindingType } from '../../types/BindingManager';
import { COLORS } from '../../styles/colors';
import { GAPS } from '../../styles/dimensions';

export class BattleSideMenu {
  private ui: BattleSideMenuProps['ui'];
  private getIsPlayerTurn: () => boolean;
  private getHasAttackableBeasts: () => boolean;
  private onAction?: (action: string) => void;
  private onStopTurnTimer?: () => void;
  private playSfx?: (sfxId: string) => void;

  constructor(props: BattleSideMenuProps) {
    this.ui = props.ui;
    this.getIsPlayerTurn = props.getIsPlayerTurn;
    this.getHasAttackableBeasts = props.getHasAttackableBeasts;
    this.onAction = props.onAction;
    this.onStopTurnTimer = props.onStopTurnTimer;
    this.playSfx = props.playSfx;

    console.log('[BattleSideMenu] Constructor - onAction:', this.onAction ? 'DEFINED' : 'UNDEFINED');
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
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('side-menu') || null,
          style: {
            position: 'absolute',
            width: 127,
            height: 465,
          },
        }),

        // Forfeit button (at header position)
        createButton({
          ui: this.ui,
          label: 'Forfeit',
          onClick: () => {
            console.log('[BattleSideMenu] Forfeit button clicked');
            this.onAction?.('btn-forfeit');
          },
          color: 'default',
          playSfx: this.playSfx,
          style: {
            position: 'absolute',
            left: sideMenuPositions.headerStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.headerStartPosition.y - sideMenuPositions.y,
          },
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
              text: 'Battle',
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                state ? `Turn ${state.currentTurn}` : 'Turn 1'
              ),
              style: {
                fontSize: 18,
                color: '#fff',
                marginBottom: 5,
              },
            }),
          ],
        }),

        // Attack button (red) - positioned above End Turn button
        createButton({
          ui: this.ui,
          label: 'Attack',
          onClick: () => {
            console.log('[BattleSideMenu] Attack button onClick fired!');
            const currentIsPlayerTurn = this.getIsPlayerTurn();
            const hasAttackable = this.getHasAttackableBeasts();
            console.log('[BattleSideMenu] Attack button clicked, isPlayerTurn:', currentIsPlayerTurn, 'hasAttackable:', hasAttackable);

            if (currentIsPlayerTurn && hasAttackable) {
              console.log('[BattleSideMenu] Calling onAction with auto-attack-all');
              this.onAction?.('auto-attack-all');
              // Auto end turn after attacking
              console.log('[BattleSideMenu] Auto ending turn after attack');
              this.onStopTurnTimer?.();
              this.onAction?.('end-turn');
            } else {
              console.log('[BattleSideMenu] Attack button cannot be used - turn:', currentIsPlayerTurn, 'attackable:', hasAttackable);
            }
          },
          // Use complete bindings (avoids .derive() on derived bindings)
          imageSource: this.ui.assetIdToImageSource?.('red-button') || null,
          opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            // Disabled if state not ready
            if (!state) return 0.5;

            // Disabled if not player turn
            if (state.turnPlayer !== 'player') return 0.5;

            // Check if player has any attackable beasts
            let hasAttackable = false;
            if (state.playerField && Array.isArray(state.playerField)) {
              for (const beast of state.playerField) {
                if (beast && canAttack(beast)) {
                  hasAttackable = true;
                  break;
                }
              }
            }

            return hasAttackable ? 1.0 : 0.5;
          }),
          textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            // Disabled if state not ready
            if (!state) return '#888';

            // Disabled if not player turn
            if (state.turnPlayer !== 'player') return '#888';

            // Check if player has any attackable beasts
            let hasAttackable = false;
            if (state.playerField && Array.isArray(state.playerField)) {
              for (const beast of state.playerField) {
                if (beast && canAttack(beast)) {
                  hasAttackable = true;
                  break;
                }
              }
            }

            return hasAttackable ? COLORS.textPrimary : '#888';
          }),
          disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            // Disabled if state not ready
            if (!state) return true;

            // Disabled if not player turn
            const notPlayerTurn = state.turnPlayer !== 'player';
            if (notPlayerTurn) return true;

            // Check if player has any attackable beasts (using proper canAttack check)
            let hasAttackable = false;
            if (state.playerField && Array.isArray(state.playerField)) {
              for (const beast of state.playerField) {
                if (beast && canAttack(beast)) {
                  hasAttackable = true;
                  break;
                }
              }
            }

            // Disabled if no attackable beasts
            return !hasAttackable;
          }),
          playSfx: this.playSfx,
          style: {
            position: 'absolute',
            left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y - sideMenuButtonDimensions.height - GAPS.buttons,
          },
        }),

        // End Turn button with timer - uses derived bindings for reactive updates
        createButton({
          ui: this.ui,
          label: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            state?.turnPlayer === 'player' ? 'End Turn' : 'Enemy Turn'
          ),
          onClick: () => {
            console.log('[BattleSideMenu] End Turn button onClick fired!');
            const currentIsPlayerTurn = this.getIsPlayerTurn();
            console.log('[BattleSideMenu] End Turn button clicked, isPlayerTurn:', currentIsPlayerTurn);
            console.log('[BattleSideMenu] onAction defined?', this.onAction ? 'YES' : 'NO');
            if (currentIsPlayerTurn) {
              this.onStopTurnTimer?.();
              console.log('[BattleSideMenu] Calling onAction with end-turn');
              this.onAction?.('end-turn');
            } else {
              console.log('[BattleSideMenu] End Turn clicked but not player turn');
            }
          },
          // Use complete bindings (avoids .derive() on derived bindings)
          imageSource: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            const color = state?.turnPlayer === 'player' ? 'green' : 'default';
            const assetId = color === 'green' ? 'green-button' : 'standard-button';
            return this.ui.assetIdToImageSource?.(assetId) || null;
          }),
          opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            state?.turnPlayer !== 'player' ? 0.5 : 1.0
          ),
          textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            state?.turnPlayer !== 'player' ? '#888' : COLORS.textPrimary
          ),
          disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            state?.turnPlayer !== 'player'
          ),
          playSfx: this.playSfx,
          style: {
            position: 'absolute',
            left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y,
          },
        }),
      ],
    });
  }
}
