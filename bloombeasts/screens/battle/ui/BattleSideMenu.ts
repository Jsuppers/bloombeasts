/**
 * Battle side menu - Turn counter, end turn button, forfeit
 */

import type { BattleSideMenuProps } from './types';
import { sideMenuPositions } from '../../../common/ui/constants/positions';
import { sideMenuButtonDimensions, GAPS } from '../../../common/ui/styles/styles/dimensions';
import { UINodeType } from '../../../common/ui/ScreenUtils';
import { BattleDisplay } from '../../../gameManager';
import { canAttack } from '../../../common/engine/utils/combatHelpers';
import { createButton } from '../../../common/ui/components/common/Button';
import { BindingType } from '../../../common/ui/types/types/BindingManager';
import { COLORS } from '../../../common/ui/styles/styles/colors';

// Side menu container dimensions
const SIDE_MENU_WIDTH = 225;
const SIDE_MENU_HEIGHT = 497;

export class BattleSideMenu {
  private ui: BattleSideMenuProps['ui'];
  private getIsPlayerTurn: () => boolean;
  private getHasAttackableBeasts: () => boolean;
  private onAction?: (action: string) => void;
  private onActionAsync?: (action: string) => Promise<void>;
  private onStopTurnTimer?: () => void;
  private playSfx?: (sfxId: string) => void;

  constructor(props: BattleSideMenuProps) {
    this.ui = props.ui;
    this.getIsPlayerTurn = props.getIsPlayerTurn;
    this.getHasAttackableBeasts = props.getHasAttackableBeasts;
    this.onAction = props.onAction;
    this.onActionAsync = props.onActionAsync;
    this.onStopTurnTimer = props.onStopTurnTimer;
    this.playSfx = props.playSfx;
  }

  /**
   * Helper function to check if it's the player's turn
   */
  private isPlayerTurn(state: BattleDisplay | null): boolean {
    return state?.turnPlayer === 'player';
  }

  /**
   * Helper function to check if player has attackable beasts
   */
  private hasAttackableBeasts(state: BattleDisplay | null): boolean {
    if (!this.isPlayerTurn(state)) return false;

    if (state!.playerField && Array.isArray(state!.playerField)) {
      for (const beast of state!.playerField) {
        if (beast && canAttack(beast)) {
          return true;
        }
      }
    }

    return false;
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
        width: SIDE_MENU_WIDTH,
        height: SIDE_MENU_HEIGHT,
      },
      children: [
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('container-side-menu') || null,
          style: {
            position: 'absolute',
            width: SIDE_MENU_WIDTH,
            height: SIDE_MENU_HEIGHT,
          },
        }),

        // Forfeit button (at header position)
        createButton({
          ui: this.ui,
          label: 'Forfeit',
          onClick: () => {
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

        // Attack button (red) - positioned above End Turn button
        createButton({
          ui: this.ui,
          label: 'Attack',
          onClick: async () => {
            console.log('[BattleSideMenu] Attack button clicked!');
            const currentIsPlayerTurn = this.getIsPlayerTurn();
            const hasAttackable = this.getHasAttackableBeasts();
            console.log('[BattleSideMenu] currentIsPlayerTurn:', currentIsPlayerTurn, 'hasAttackable:', hasAttackable);

            if (currentIsPlayerTurn && hasAttackable) {
              console.log('[BattleSideMenu] Calling onActionAsync with auto-attack-all');
              // Attack and wait for it to complete, then auto end turn
              await this.onActionAsync?.('auto-attack-all');
              this.onStopTurnTimer?.();
              this.onAction?.('end-turn');
            } else {
              console.log('[BattleSideMenu] Attack button clicked but conditions not met');
            }
          },
          // Use complete bindings (avoids .derive() on derived bindings)
          imageSource: this.ui.assetIdToImageSource?.('red-button') || null,
          opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            return this.hasAttackableBeasts(state) ? 1.0 : 0.5;
          }),
          textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            return this.hasAttackableBeasts(state) ? COLORS.textPrimary : '#888';
          }),
          disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            return !this.hasAttackableBeasts(state);
          }),
          playSfx: this.playSfx,
          style: {
            position: 'absolute',
            left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y - sideMenuButtonDimensions.height - GAPS.buttons,
          },
        }),

        // Skip button with timer - uses derived bindings for reactive updates
        createButton({
          ui: this.ui,
          label: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            this.isPlayerTurn(state) ? 'Skip' : 'Enemy Turn'
          ),
          onClick: () => {
            const currentIsPlayerTurn = this.getIsPlayerTurn();
            if (currentIsPlayerTurn) {
              this.onStopTurnTimer?.();
              this.onAction?.('end-turn');
            }
          },
          // Use complete bindings (avoids .derive() on derived bindings)
          imageSource: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
            const assetId = this.isPlayerTurn(state) ? 'green-button' : 'standard-button';
            return this.ui.assetIdToImageSource?.(assetId) || null;
          }),
          opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            this.isPlayerTurn(state) ? 1.0 : 0.5
          ),
          textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            this.isPlayerTurn(state) ? COLORS.textPrimary : '#888'
          ),
          disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
            !this.isPlayerTurn(state)
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
