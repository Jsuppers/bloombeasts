/**
 * Leaderboard Screen Component
 * Displays top players by experience and fastest Cluck Norris completion time
 */

import { COLORS } from '../styles/colors';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { UINodeType } from './ScreenUtils';
import { createSideMenu } from './common/SideMenu';
import { BindingType } from '../types/BindingManager';

export interface LeaderboardEntry {
  playerName: string;
  score: number; // XP for experience leaderboard, time in seconds for speed leaderboard
  level?: number; // Only for experience leaderboard
}

export interface LeaderboardData {
  topExperience: LeaderboardEntry[];
  fastestCluckNorris: LeaderboardEntry[];
}

export interface LeaderboardScreenProps {
  ui: UIMethodMappings;
  onNavigate?: (screen: string) => void;
  playSfx?: (sfxId: string) => void;
}

export class LeaderboardScreen {
  private ui: UIMethodMappings;
  private onNavigate?: (screen: string) => void;
  private playSfx?: (sfxId: string) => void;

  constructor(props: LeaderboardScreenProps) {
    this.ui = props.ui;
    this.onNavigate = props.onNavigate;
    this.playSfx = props.playSfx;
  }

  /**
   * Format all leaderboard entries as a single text string
   */
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
          let scoreText = '';
          if (leaderboardType === 'speed') {
            scoreText = this.formatTime(entry.score);
          } else {
            scoreText = entry.level ? `Lv${entry.level} ${entry.score}XP` : `${entry.score}XP`;
          }
          lines.push(`${rankEmoji} ${entry.playerName} - ${scoreText}`);
        } else {
          lines.push(`${rankEmoji} ---`);
        }
      }
      return lines.join('\n');
    });
  }

  /**
   * Format time in seconds to readable format
   */
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Create a single leaderboard panel with text column
   */
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
        // Title
        this.ui.View({
          style: {
            width: panelWidth,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 10,
          },
          children: this.ui.Text({
            text: title,
            style: {
              fontSize: DIMENSIONS.fontSize.xl,
              fontWeight: 'bold',
              color: COLORS.primary,
              // textAlign: 'center',
            },
          }),
        }),
        // All entries as a single text column
        this.ui.View({
          style: {
            position: 'absolute',
            top: 70,
            left: 25,
            width: panelWidth - 50,
            height: panelHeight - 80,
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('background') || null,
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),
        // Cards Container image as background
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('cards-container') || null,
          style: {
            position: 'absolute',
            left: 40,
            top: 40,
            width: 980,
            height: 640,
          },
        }),
        // Leaderboard panels - pre-created with reactive data
        this.ui.View({
          style: {
            position: 'absolute',
            left: 70,
            top: 0,
            width: 920,
            height: 720,
          },
          children: [
            // Experience Leaderboard (left)
            this.createLeaderboardPanel(
              '🏆 Top Experience',
              'experience',
              0
            ),
            // Speed Leaderboard (right)
            this.createLeaderboardPanel(
              '🐔 Fastest Cluck Norris',
              'speed',
              460
            ),
          ],
        }),
        // Sidebar with common side menu
        createSideMenu(this.ui, {
          title: 'Leaderboard',
          customTextContent: [
            this.ui.View({
              style: {
                position: 'relative',
                width: 150,
              },
              children: this.ui.Text({
                text: 'Who is the Cluck Mister?',
                numberOfLines: 2,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: COLORS.textPrimary,
                  lineHeight: DIMENSIONS.fontSize.lg + 5,
                },
              }),
            }),
          ],
          buttons: [],
          bottomButton: {
            label: 'Back',
            onClick: () => {
              if (this.onNavigate) this.onNavigate('menu');
            },
            disabled: false,
          },
          playSfx: this.playSfx,
        }),
      ],
    });
  }

  dispose(): void {
    // Nothing to clean up
  }
}
