/**
 * Player and opponent info displays (health, nectar, deck count, timer)
 */

import type { InfoDisplaysProps } from './types';
import { nectarEmoji, deckEmoji } from '../../constants/emojis';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from '../../../gameManager';
import { BindingType, UIState } from '../../types/BindingManager';

export class InfoDisplays {
  private ui: InfoDisplaysProps['ui'];

  constructor(props: InfoDisplaysProps) {
    this.ui = props.ui;
  }

  /**
   * Create player and opponent info displays - Centered at top with two columns
   */
  createInfoDisplays(): UINodeType {
    const boxWidth = 225;
    const centerX = 640; // Center of 1280px wide screen
    const topY = 10;

    return this.ui.View({
      style: {
        position: 'absolute',
        left: centerX - boxWidth / 2,
        top: topY,
        width: boxWidth,
        height: 125,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(74, 142, 194, 0.8)',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        gap: 10,
      },
      children: [
        // Opponent column (left)
        this.ui.View({
          style: {
            flex: 1,
            flexDirection: 'column',
            gap: 3,
            paddingRight: 5,
            borderRightWidth: 1,
            borderRightColor: 'rgba(255, 255, 255, 0.3)',
          },
          children: [
            this.ui.Text({
              text: 'Opponent',
              style: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#ff6b6b',
                textAlign: 'center',
              },
            }),
            // Timer
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                state.battle?.opponentTimer ? `⏱️ ${state.battle.opponentTimer}` : '⏱️ 0:00'
              ),
              style: {
                fontSize: 15,
                fontWeight: 'bold',
                color: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                  state.battle?.opponentTimer ? '#ff6b6b' : '#fff'
                ),
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                state ? `❤️ ${state?.opponentHealth}/${state?.opponentMaxHealth}` : '❤️ 20/20'
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                state ? `${nectarEmoji} ${state.opponentNectar}/10` : `${nectarEmoji} 0/10`
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                state ? `${deckEmoji} ${state.opponentDeckCount}/30` : `${deckEmoji} 30/30`
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
          ],
        }),

        // Player column (right)
        this.ui.View({
          style: {
            flex: 1,
            flexDirection: 'column',
            gap: 3,
            paddingLeft: 5,
          },
          children: [
            this.ui.Text({
              text: 'Player',
              style: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#4a8ec2',
                textAlign: 'center',
              },
            }),
            // Timer
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                state.battle?.playerTimer ? `⏱️ ${state.battle.playerTimer}` : '⏱️ 0:00'
              ),
              style: {
                fontSize: 15,
                fontWeight: 'bold',
                color: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                  state.battle?.playerTimer ? '#4a8ec2' : '#fff'
                ),
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                state ? `❤️ ${state.playerHealth}/${state.playerMaxHealth}` : '❤️ 20/20'
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                state ? `${nectarEmoji} ${state.playerNectar}/10` : `${nectarEmoji} 0/10`
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                state ? `${deckEmoji} ${state?.playerDeckCount}/30` : `${deckEmoji} 30/30`
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
          ],
        }),
      ],
    });
  }
}
