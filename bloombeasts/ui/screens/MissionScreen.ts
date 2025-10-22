/**
 * Unified Mission Screen Component
 * Works on both Horizon and Web platforms
 */

import { View, Text, Image, Pressable, Binding } from '../index';
import { COLORS } from '../../../shared/styles/colors';
import { DIMENSIONS, GAPS } from '../../../shared/styles/dimensions';
import { sideMenuButtonDimensions } from '../../../shared/constants/dimensions';
import { missionEmoji } from '../../../shared/constants/emojis';
import type { MissionDisplay, MenuStats } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';

export interface MissionScreenProps {
  missions: any;
  stats: any;
  onMissionSelect?: (missionId: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
}

/**
 * Unified Mission Screen that works on both platforms
 */
export class MissionScreen {
  private missions: any;
  private stats: any;
  private scrollOffset: any;
  private missionsPerRow = 3;
  private rowsPerPage = 3;
  private onMissionSelect?: (missionId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;

  constructor(props: MissionScreenProps) {
    this.missions = props.missions;
    this.stats = props.stats;
    this.onMissionSelect = props.onMissionSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.scrollOffset = new Binding(0);
  }

  /**
   * Create the unified mission UI
   */
  createUI(): UINodeType {
    // Create scroll buttons for the side menu
    const scrollButtons = [
      {
        label: '↑',
        onClick: () => {
          const current = this.scrollOffset.get();
          const missions = this.missions.get();
          const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
          const totalPages = Math.ceil(missions.length / missionsPerPage);

          const newOffset = current - 1;
          if (newOffset >= 0) {
            this.scrollOffset.set(newOffset);
            // Trigger re-render after updating scroll position
            if (this.onRenderNeeded) this.onRenderNeeded();
          }
        },
        disabled: Binding.derive(
          [this.missions, this.scrollOffset],
          (missions: any[], offset: number) => offset <= 0
        ) as any,
        yOffset: 0,
      },
      {
        label: '↓',
        onClick: () => {
          const current = this.scrollOffset.get();
          const missions = this.missions.get();
          const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
          const totalPages = Math.ceil(missions.length / missionsPerPage);

          const newOffset = current + 1;
          if (newOffset < totalPages) {
            this.scrollOffset.set(newOffset);
            // Trigger re-render after updating scroll position
            if (this.onRenderNeeded) this.onRenderNeeded();
          }
        },
        disabled: Binding.derive(
          [this.missions, this.scrollOffset],
          (missions: any[], offset: number) => {
            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(missions.length / missionsPerPage);
            return offset >= totalPages - 1;
          }
        ) as any,
        yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
      },
    ];

    // Mission completion text
    const completionText = this.missions.derive((missions: MissionDisplay[]) => {
      const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
      return `${missionEmoji} ${completedCount}/${missions.length}`;
    });

    return View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        Image({
          source: new Binding({ uri: 'background' }),
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),
        // Main content - mission grid
        View({
          style: {
            position: 'absolute',
            width: 1100,
            height: '100%',
            padding: 40,
          },
          children: [
            View({
              style: {
                padding: 30,
                backgroundColor: COLORS.cardBackground,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: COLORS.borderDefault,
                flex: 1,
              },
              children: Binding.derive(
                [this.missions, this.scrollOffset],
                (missions: MissionDisplay[], offset: number) => {
                  if (missions.length === 0) {
                    return [
                      View({
                        style: {
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                        children: Text({
                          text: new Binding('No missions available.'),
                          style: {
                            fontSize: DIMENSIONS.fontSize.xl,
                            color: COLORS.textSecondary,
                          },
                        }),
                      }),
                    ];
                  }

                  // Create mission grid inline for reactivity
                  const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
                  const startIndex = offset * missionsPerPage;
                  const endIndex = Math.min(startIndex + missionsPerPage, missions.length);
                  const visibleMissions = missions.slice(startIndex, endIndex);

                  const rows: UINodeType[] = [];
                  for (let row = 0; row < this.rowsPerPage; row++) {
                    const rowMissions = visibleMissions.slice(
                      row * this.missionsPerRow,
                      (row + 1) * this.missionsPerRow
                    );

                    if (rowMissions.length > 0) {
                      rows.push(
                        View({
                          style: {
                            flexDirection: 'row',
                            marginBottom: row < this.rowsPerPage - 1 ? GAPS.missions : 0,
                          },
                          children: rowMissions.map((mission: MissionDisplay, index: number) =>
                            View({
                              style: {
                                marginRight: index < rowMissions.length - 1 ? GAPS.missions : 0,
                              },
                              children: this.createMissionCard(mission),
                            })
                          ),
                        })
                      );
                    }
                  }

                  return [
                    View({
                      style: {
                        flexDirection: 'column',
                      },
                      children: rows,
                    })
                  ];
                }
              ) as any,
            }),
          ],
        }),
        // Sidebar with common side menu
        createSideMenu({
          title: 'Missions',
          customTextContent: [
            createTextRow(completionText as any, 0),
          ],
          buttons: scrollButtons,
          bottomButton: {
            label: 'Back',
            onClick: () => {
              if (this.onNavigate) this.onNavigate('menu');
            },
            disabled: false,
          },
          stats: this.stats,
        }),
      ],
    });
  }

  /**
   * Create mission card
   */
  private createMissionCard(mission: MissionDisplay): UINodeType {
    const difficultyColor = {
      easy: COLORS.success,
      medium: COLORS.warning,
      hard: COLORS.error
    }[mission.difficulty as 'easy' | 'medium' | 'hard'] || COLORS.textSecondary;

    return Pressable({
      onClick: () => {
        if (!mission.isCompleted && this.onMissionSelect) {
          this.onMissionSelect(mission.id);
        }
      },
      style: {
        width: 280,
        backgroundColor: mission.isCompleted ? COLORS.disabled : COLORS.panelBackground,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: mission.isCompleted ? COLORS.borderDefault : COLORS.primary,
        padding: 15,
        opacity: mission.isCompleted ? 0.6 : 1,
      },
      children: [
        // Title
        Text({
          text: new Binding(mission.name),
          numberOfLines: 2,
          style: {
            fontSize: DIMENSIONS.fontSize.lg,
            fontWeight: 'bold',
            color: COLORS.textPrimary,
            marginBottom: 10,
          },
        }),
        // Description
        Text({
          text: new Binding(mission.description),
          numberOfLines: 3,
          style: {
            fontSize: DIMENSIONS.fontSize.sm,
            color: COLORS.textSecondary,
            marginBottom: 10,
          },
        }),
        // Footer with difficulty and level
        View({
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          children: [
            Text({
              text: new Binding(`Level ${mission.level}`),
              style: {
                fontSize: DIMENSIONS.fontSize.sm,
                color: COLORS.textSecondary,
              },
            }),
            Text({
              text: new Binding(mission.difficulty.toUpperCase()),
              style: {
                fontSize: DIMENSIONS.fontSize.sm,
                fontWeight: 'bold',
                color: difficultyColor,
              },
            }),
          ],
        }),
        // Status badge
        mission.isCompleted
          ? View({
              style: {
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: COLORS.success,
                borderRadius: 4,
                padding: 4,
              },
              children: Text({
                text: new Binding('✓'),
                style: {
                  fontSize: DIMENSIONS.fontSize.sm,
                  color: '#fff',
                },
              }),
            })
          : View({}),
      ],
    });
  }

  dispose(): void {
    // Cleanup
  }
}
