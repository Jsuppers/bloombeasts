/**
 * Leaderboard Screen
 */

import { COLORS } from '../../common/ui/styles/styles/colors';
import { DIMENSIONS } from '../../common/ui/styles/styles/dimensions';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { createSideMenu } from '../../common/ui/screens/SideMenu';
import { BindingType } from '../../common/ui/types/types/BindingManager';
import { BaseScreen, BaseScreenProps } from '../common/BaseScreen';

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  level?: number;
}

export interface LeaderboardData {
  topExperience: LeaderboardEntry[];
  fastestCluckNorris: LeaderboardEntry[];
}

export type LeaderboardScreenProps = BaseScreenProps;

export class LeaderboardScreen extends BaseScreen {
  constructor(props: LeaderboardScreenProps) {
    super(props);
  }

  private formatLeaderboardText(leaderboardType: 'experience' | 'speed'): any {
    return this.ui.bindingManager.derive([BindingType.LeaderboardData], (data: LeaderboardData | null) => {
      if (!data) return '';
      const entries = leaderboardType === 'experience' ? data.topExperience : data.fastestCluckNorris;
      if (!entries || entries.length === 0) return 'No entries yet...';

      const lines: string[] = [];
      for (let i = 0; i < 10; i++) {
        const rank = i + 1;
        const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

        if (entries[i]) {
          const entry = entries[i];
          const scoreText = leaderboardType === 'speed'
            ? this.formatTime(entry.score)
            : entry.level ? `Lv${entry.level} ${entry.score}XP` : `${entry.score}XP`;
          lines.push(`${rankEmoji} ${entry.playerName} - ${scoreText}`);
        } else {
          lines.push(`${rankEmoji} ---`);
        }
      }
      return lines.join('\n');
    });
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private createLeaderboardPanel(
    title: string,
    leaderboardType: 'experience' | 'speed',
    left: number
  ): UINodeType {
    const panelWidth = 450;
    const panelHeight = 580;

    return this.ui.View({
      style: {
        position: 'absolute',
        left: left,
        top: 70,
        width: panelWidth,
        height: panelHeight,
      },
      children: [
        this.ui.View({
          style: {
            width: panelWidth,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          },
          children: this.ui.Text({
            text: title,
            style: {
              fontSize: DIMENSIONS.fontSize.xl,
              fontWeight: 'bold',
              color: COLORS.primary,
            },
          }),
        }),
        this.ui.View({
          style: {
            position: 'absolute',
            top: 70,
            left: 25,
            width: panelWidth - 50,
            height: panelHeight - 80,
            borderRadius: 10,
            padding: 15,
          },
          children: this.ui.Text({
            text: this.formatLeaderboardText(leaderboardType),
            numberOfLines: 10,
            style: {
              fontSize: DIMENSIONS.fontSize.md,
              color: COLORS.textPrimary,
              lineHeight: 40,
            },
          }),
        }),
      ],
    });
  }

  createUI(): UINodeType {
    return this.createRootContainer([
      this.createFullScreenBackground(),
      this.createContainerBackground(),

      // Two leaderboard panels
      this.createLeaderboardPanel('Top Experience', 'experience', 70),
      this.createLeaderboardPanel('Fastest Cluck Norris', 'speed', 540),

      createSideMenu(this.ui, {
        title: 'Leaderboard',
        bottomButton: this.getBackButton(),
        playSfx: this.playSfx,
      }),
    ]);
  }
}
