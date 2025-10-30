/**
 * Player and opponent info displays (health, nectar, deck count)
 */

import type { BattleComponentProps } from './types';
import { battleBoardAssetPositions } from './types';
import { nectarEmoji, deckEmoji } from '../../constants/emojis';
import { UINodeType } from '../ScreenUtils';
import { BattleDisplay } from 'bloombeasts/gameManager';

export class InfoDisplays {
  private ui: BattleComponentProps['ui'];
  private battleDisplay: BattleComponentProps['battleDisplay'];

  constructor(props: BattleComponentProps) {
    this.ui = props.ui;
    this.battleDisplay = props.battleDisplay;
  }

  /**
   * Create player and opponent info displays - Fully reactive
   */
  createInfoDisplays(): UINodeType {
    const opponentHealthPos = battleBoardAssetPositions.playerOne.health;
    const playerHealthPos = battleBoardAssetPositions.playerTwo.health;
    const opponentInfoPos = battleBoardAssetPositions.playOneInfoPosition;
    const playerInfoPos = battleBoardAssetPositions.playTwoInfoPosition;

    return this.ui.View({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      children: [
        // Opponent health
        this.ui.View({
          style: {
            position: 'absolute',
            left: opponentHealthPos.x - 40,
            top: opponentHealthPos.y - 15,
            width: 80,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.ui.Binding.derive(
              [this.battleDisplay],
              (state: BattleDisplay) => {
                if (!state) return 'transparent';
                const isTarget = state.attackAnimation?.targetPlayer === 'health' &&
                                state.attackAnimation?.attackerPlayer === 'player';
                return isTarget ? 'rgba(255, 0, 0, 0.4)' : 'transparent';
              }
            ),
            borderRadius: 4,
          },
          children: this.ui.Text({
            text: this.ui.Binding.derive(
              [this.battleDisplay],
              (state: BattleDisplay) => state ? `${state.opponentHealth}/${state.opponentMaxHealth}` : '20/20'
            ),
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
            },
          }),
        }),

        // Player health
        this.ui.View({
          style: {
            position: 'absolute',
            left: playerHealthPos.x - 40,
            top: playerHealthPos.y - 15,
            width: 80,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.ui.Binding.derive(
              [this.battleDisplay],
              (state: BattleDisplay) => {
                if (!state) return 'transparent';
                const isTarget = state.attackAnimation?.targetPlayer === 'health' &&
                                state.attackAnimation?.attackerPlayer === 'opponent';
                return isTarget ? 'rgba(255, 0, 0, 0.4)' : 'transparent';
              }
            ),
            borderRadius: 4,
          },
          children: this.ui.Text({
            text: this.ui.Binding.derive(
              [this.battleDisplay],
              (state: BattleDisplay) => state ? `${state.playerHealth}/${state.playerMaxHealth}` : '20/20'
            ),
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
            },
          }),
        }),

        // Opponent info
        this.ui.View({
          style: {
            position: 'absolute',
            left: opponentInfoPos.x,
            top: opponentInfoPos.y,
          },
          children: [
            this.ui.Text({
              text: new this.ui.Binding('Opponent'),
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
                (state: BattleDisplay) => state ? `${nectarEmoji} ${state.opponentNectar}/10` : `${nectarEmoji} 0/10`
              ),
              style: {
                fontSize: 18,
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `${deckEmoji} ${state.opponentDeckCount}/30` : `${deckEmoji} 30/30`
              ),
              style: {
                fontSize: 18,
                color: '#fff',
              },
            }),
          ],
        }),

        // Player info
        this.ui.View({
          style: {
            position: 'absolute',
            left: playerInfoPos.x,
            top: playerInfoPos.y,
          },
          children: [
            this.ui.Text({
              text: new this.ui.Binding('Player'),
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
                (state: BattleDisplay) => state ? `${nectarEmoji} ${state.playerNectar}/10` : `${nectarEmoji} 0/10`
              ),
              style: {
                fontSize: 18,
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [this.battleDisplay],
                (state: BattleDisplay) => state ? `${deckEmoji} ${state.playerDeckCount}/30` : `${deckEmoji} 30/30`
              ),
              style: {
                fontSize: 18,
                color: '#fff',
              },
            }),
          ],
        }),
      ],
    });
  }
}
