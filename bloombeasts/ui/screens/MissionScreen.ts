/**
 * Mission Screen - Refactored with UI Component System
 */

import { COLORS } from '../styles/colors';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import { sideMenuButtonDimensions } from '../constants/dimensions';
import type { SimplePosition } from '../constants/positions';
import { missionEmoji } from '../constants/emojis';
import type { MissionDisplay, MenuStats } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';

// MissionScreen-specific constants
const missionCardDimensions = {
  width: 290,
  height: 185,
};

const cardsUIContainerDimensions = {
  width: 950,
  height: 640,
};

const missionCardPositions = {
  name: { x: 97, y: 10, size: DIMENSIONS.fontSize.xl, textAlign: 'left' as const, textBaseline: 'top' as const },
  image: { x: 16, y: 16 },
  level: { x: 97, y: 43, size: DIMENSIONS.fontSize.xs, textAlign: 'left' as const, textBaseline: 'top' as const },
  difficulty: { x: 97, y: 66, size: DIMENSIONS.fontSize.xs, textAlign: 'left' as const, textBaseline: 'top' as const },
  description: { x: 13, y: 98, size: DIMENSIONS.fontSize.sm, textAlign: 'left' as const, textBaseline: 'top' as const },
};

const cardsUIContainerPosition: SimplePosition = {
  x: 103,
  y: 41,
};

export interface MissionScreenProps {
  ui: UIMethodMappings;
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
  // UI methods (injected)
  private ui: UIMethodMappings;

  // State bindings
  private missions: any;
  private stats: any;
  private scrollOffset: any;

  // Configuration
  private missionsPerRow: number = 3;
  private rowsPerPage: number = 3;

  // Callbacks
  private onMissionSelect?: (missionId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;

  constructor(props: MissionScreenProps) {
    this.ui = props.ui;
    this.scrollOffset = new this.ui.Binding(0);
    this.missions = props.missions;
    this.stats = props.stats;
    this.onMissionSelect = props.onMissionSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;

    // Subscribe to scrollOffset changes to trigger re-renders
    this.scrollOffset.subscribe(() => {
      if (this.onRenderNeeded) {
        this.onRenderNeeded();
      }
    });
  }

  /**
   * Create the missions UI
   */
  createUI(): UINodeType {
    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background image (full screen)
        this.createBackground(),

        // Main content area with mission grid
        this.createMainContent(),

        // Side menu with controls (absolutely positioned)
        this.createSideMenu(),
      ],
    });
  }

  /**
   * Create full-screen background image
   */
  private createBackground(): UINodeType {
    return this.ui.Image({
      source: new this.ui.Binding({ uri: 'background' }),
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      },
    });
  }

  /**
   * Create main content area with mission grid
   */
  private createMainContent(): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        left: cardsUIContainerPosition.x,
        top: cardsUIContainerPosition.y,
        width: cardsUIContainerDimensions.width,
        height: cardsUIContainerDimensions.height,
      },
      children: [
        // Cards container background image
        this.ui.Image({
          source: new this.ui.Binding({ uri: 'cards-container' }),
          style: {
            position: 'absolute',
            width: cardsUIContainerDimensions.width,
            height: cardsUIContainerDimensions.height,
            top: 0,
            left: 0,
          },
        }),
        // Content on top of container image
        this.ui.View({
          style: {
            position: 'relative',
            paddingLeft: DIMENSIONS.spacing.xl,
            paddingTop: DIMENSIONS.spacing.xl,
            width: cardsUIContainerDimensions.width,
            height: cardsUIContainerDimensions.height,
          },
          children: this.missions.derive((missions: MissionDisplay[]) => {
            if (missions.length === 0) {
              return [
                this.ui.View({
                  style: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  children: this.ui.Text({
                    text: new this.ui.Binding('No missions available yet.'),
                    style: {
                      fontSize: DIMENSIONS.fontSize.xl,
                      color: COLORS.textSecondary,
                    },
                  }),
                }),
              ];
            }

            return [this.createMissionGrid()];
          }) as any,
        }),
      ],
    });
  }

  /**
   * Create the mission grid
   */
  private createMissionGrid(): UINodeType {
    const cardWidth = missionCardDimensions.width;
    const cardHeight = missionCardDimensions.height;
    const gapX = 12; // Gap between cards horizontally
    const gapY = 12; // Gap between cards vertically
    const startX = 24; // Left offset from container edge
    const startY = 24; // Top offset from container edge
    const spacingX = cardWidth + gapX; // Total horizontal space per card
    const spacingY = cardHeight + gapY; // Total vertical space per card

    return this.ui.View({
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
      },
      children: this.ui.Binding.derive(
        [this.missions, this.scrollOffset],
        (missions: MissionDisplay[], offset: number) => {
          const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
          const startIndex = offset * missionsPerPage;
          const endIndex = Math.min(startIndex + missionsPerPage, missions.length);
          const visibleMissions = missions.slice(startIndex, endIndex);

          // Create absolutely positioned cards
          const cards: UINodeType[] = [];
          for (let i = 0; i < visibleMissions.length; i++) {
            const mission = visibleMissions[i];
            const row = Math.floor(i / this.missionsPerRow);
            const col = i % this.missionsPerRow;
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            cards.push(
              this.ui.View({
                style: {
                  position: 'absolute',
                  left: x,
                  top: y,
                },
                children: this.createMissionItem(mission),
              })
            );
          }

          return cards;
        }
      ) as any,
    });
  }

  /**
   * Create a single mission item
   */
  private createMissionItem(mission: MissionDisplay): UINodeType {
    // Determine mission background image based on affinity
    let missionImageName = 'forest-mission'; // Default
    if (mission.affinity === 'Water') missionImageName = 'water-mission';
    else if (mission.affinity === 'Fire') missionImageName = 'fire-mission';
    else if (mission.affinity === 'Sky') missionImageName = 'sky-mission';
    else if (mission.affinity === 'Boss') missionImageName = 'boss-mission';

    const cardWidth = missionCardDimensions.width;
    const cardHeight = missionCardDimensions.height;
    const beastSize = 70; // Beast image size (70x70)

    return this.ui.Pressable({
      onClick: () => {
        if (mission.isAvailable && this.onMissionSelect) {
          this.onMissionSelect(mission.id);
        }
      },
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
        opacity: mission.isAvailable ? 1 : 0.4,
      },
      children: [
        // Mission-specific background image (ForestMission, WaterMission, etc.)
        this.ui.Image({
          source: new this.ui.Binding({ uri: missionImageName }),
          style: {
            position: 'absolute',
            width: cardWidth,
            height: cardHeight,
            top: 0,
            left: 0,
          },
        }),

        // Beast image (if available)
        mission.beastId
          ? this.ui.Image({
              source: new this.ui.Binding({ uri: mission.beastId.toLowerCase().replace(/\s+/g, '-') }),
              style: {
                position: 'absolute',
                width: beastSize,
                height: beastSize,
                left: missionCardPositions.image.x,
                top: missionCardPositions.image.y,
                opacity: mission.isAvailable ? 1 : 0.4,
              },
            })
          : this.ui.View({}),

        // Mission name
        this.ui.Text({
          text: new this.ui.Binding(mission.name),
          numberOfLines: 1,
          style: {
            position: 'absolute',
            left: missionCardPositions.name.x,
            top: missionCardPositions.name.y,
            fontSize: DIMENSIONS.fontSize.xl,
            color: COLORS.textPrimary,
            fontWeight: 'bold',
          },
        }),

        // Level
        this.ui.Text({
          text: new this.ui.Binding(`Level ${mission.level}`),
          style: {
            position: 'absolute',
            left: missionCardPositions.level.x,
            top: missionCardPositions.level.y,
            fontSize: DIMENSIONS.fontSize.xs,
            color: COLORS.textSecondary,
          },
        }),

        // Difficulty
        this.ui.Text({
          text: new this.ui.Binding(`Difficulty: ${mission.difficulty}`),
          style: {
            position: 'absolute',
            left: missionCardPositions.difficulty.x,
            top: missionCardPositions.difficulty.y,
            fontSize: DIMENSIONS.fontSize.xs,
            color: this.getDifficultyColor(mission.difficulty),
          },
        }),

        // Description
        this.ui.Text({
          text: new this.ui.Binding(mission.description || ''),
          numberOfLines: 3,
          style: {
            position: 'absolute',
            left: missionCardPositions.description.x,
            top: missionCardPositions.description.y,
            width: cardWidth - 26, // Some padding
            fontSize: DIMENSIONS.fontSize.sm,
            color: COLORS.textPrimary,
          },
        }),

        // Dark overlay for locked missions
        !mission.isAvailable
          ? this.ui.View({
              style: {
                position: 'absolute',
                width: cardWidth,
                height: cardHeight,
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
              children: this.ui.Text({
                text: new this.ui.Binding('🔒'),
                style: {
                  position: 'absolute',
                  left: cardWidth / 2 - 15,
                  top: cardHeight / 2 - 15,
                  fontSize: 30,
                  color: COLORS.textPrimary,
                },
              }),
            })
          : this.ui.View({}),

        // Completed checkmark
        mission.isCompleted
          ? this.ui.Text({
              text: new this.ui.Binding('✅'),
              style: {
                position: 'absolute',
                right: 10,
                top: 10,
                fontSize: 20,
              },
            })
          : this.ui.View({}),
      ],
    });
  }

  /**
   * Get difficulty color for UI
   */
  private getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'tutorial':
        return '#90EE90'; // Light green
      case 'easy':
        return '#87CEEB'; // Sky blue
      case 'normal':
        return '#FFD700'; // Gold
      case 'hard':
        return '#FF6347'; // Tomato red
      case 'expert':
        return '#8B008B'; // Dark magenta
      case 'legendary':
        return '#FF1493'; // Deep pink
      default:
        return COLORS.textSecondary;
    }
  }

  /**
   * Create side menu with controls
   */
  private createSideMenu(): UINodeType {
    const completionText = this.ui.Binding.derive(
      [this.missions],
      (missions: MissionDisplay[]) => {
        const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
        return `${missionEmoji} ${completedCount}/${missions.length}`;
      }
    );

    return createSideMenu(this.ui, {
      title: 'Missions',
      customTextContent: [
        createTextRow(this.ui, completionText as any, 0),
      ],
      buttons: [
        {
          label: '↑',
          onClick: () => {
            const missions = this.missions.get();
            const currentOffset = this.scrollOffset.get();
            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(missions.length / missionsPerPage);

            const newOffset = currentOffset - 1;
            if (newOffset >= 0) {
              this.scrollOffset.set(newOffset);
            }
          },
          disabled: this.ui.Binding.derive(
            [this.missions, this.scrollOffset],
            (missions, offset) => offset <= 0
          ) as any,
          yOffset: 0,
        },
        {
          label: '↓',
          onClick: () => {
            const missions = this.missions.get();
            const currentOffset = this.scrollOffset.get();
            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(missions.length / missionsPerPage);

            const newOffset = currentOffset + 1;
            if (newOffset < totalPages) {
              this.scrollOffset.set(newOffset);
            }
          },
          disabled: this.ui.Binding.derive(
            [this.missions, this.scrollOffset],
            (missions: MissionDisplay[], offset: number) => {
              const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(missions.length / missionsPerPage);
              return offset >= totalPages - 1;
            }
          ) as any,
          yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
        },
      ],
      bottomButton: {
        label: 'Back',
        onClick: () => {
          if (this.onNavigate) {
            this.onNavigate('menu');
          }
        },
        disabled: false,
      },
      stats: this.stats,
    });
  }

  /**
   * Cleanup
   */
  dispose(): void {
    // No animations to clean up
  }
}
