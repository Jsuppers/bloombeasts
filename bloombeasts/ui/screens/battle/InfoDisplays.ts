/**
 * Player and opponent info displays (health, nectar, deck count)
 */

import type { BattleComponentProps } from './types';
import { battleBoardAssetPositions } from './types';
import { nectarEmoji, deckEmoji } from '../../constants/emojis';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from '../../../gameManager';

export class InfoDisplays {
  private ui: BattleComponentProps['ui'];
  private battleDisplay: BattleComponentProps['battleDisplay'];

  constructor(props: BattleComponentProps) {
    this.ui = props.ui;
    this.battleDisplay = props.battleDisplay;
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(74, 142, 194, 0.8)',
        flexDirection: 'row',
        padding: 10,
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
              text: new this.ui.Binding('Opponent'),
              style: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#ff6b6b',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `❤️ ${state.opponentHealth}/${state.opponentMaxHealth}` : '❤️ 20/20'
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `${nectarEmoji} ${state.opponentNectar}/10` : `${nectarEmoji} 0/10`
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `${deckEmoji} ${state.opponentDeckCount}/30` : `${deckEmoji} 30/30`
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
              text: new this.ui.Binding('Player'),
              style: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#4a8ec2',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `❤️ ${state.playerHealth}/${state.playerMaxHealth}` : '❤️ 20/20'
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `${nectarEmoji} ${state.playerNectar}/10` : `${nectarEmoji} 0/10`
              ),
              style: {
                fontSize: 15,
                color: '#fff',
                textAlign: 'center',
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `${deckEmoji} ${state.playerDeckCount}/30` : `${deckEmoji} 30/30`
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
