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
import { createReactiveMissionComponent, MISSION_DIMENSIONS } from './common/MissionRenderer';

// MissionScreen-specific constants
const cardsUIContainerDimensions = {
  width: 950,
  height: 640,
};

const cardsUIContainerPosition: SimplePosition = {
  x: 103,
  y: 41,
};

export interface MissionScreenProps {
  ui: UIMethodMappings;
  missions: any; // Missions binding - still separate
  playerDataBinding: any; // PlayerData binding
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
  private playerDataBinding: any;
  private scrollOffset: any;

  // Track scroll offset value for button handlers (can't use .get() in Horizon)
  private scrollOffsetValue: number = 0;

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
    this.playerDataBinding = props.playerDataBinding;
    this.onMissionSelect = props.onMissionSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
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
      source: this.ui.Binding.derive(
        [this.ui.assetsLoadedBinding],
        (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
      ),
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
          source: this.ui.Binding.derive(
            [this.ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('cards-container') : null
          ),
          style: {
            position: 'absolute',
            width: cardsUIContainerDimensions.width,
            height: cardsUIContainerDimensions.height,
            top: 0,
            left: 0,
          },
        }),
        // Content on top of container image
        // Mission grid container with reactive missions
        this.createMissionGrid(),
      ],
    });
  }

  /**
   * Create a single mission slot using reactive mission component
   */
  private createMissionSlot(slotIndex: number, missionsPerPage: number, row: number, col: number): UINodeType {
    const cardWidth = MISSION_DIMENSIONS.width;
    const cardHeight = MISSION_DIMENSIONS.height;
    const gapX = 12;
    const gapY = 12;
    const startX = 24;
    const startY = 24;
    const spacingX = cardWidth + gapX;
    const spacingY = cardHeight + gapY;
    const x = startX + col * spacingX;
    const y = startY + row * spacingY;

    return this.ui.View({
      style: {
        position: 'absolute',
        left: x,
        top: y,
      },
      children: createReactiveMissionComponent(this.ui, {
        missionsBinding: this.missions,
        scrollOffsetBinding: this.scrollOffset,
        slotIndex,
        missionsPerPage,
        onClick: (missionId: string) => {
          if (this.onMissionSelect) {
            this.onMissionSelect(missionId);
          }
        },
      }),
    });
  }

  /**
   * Create the mission grid with reactive components
   */
  private createMissionGrid(): UINodeType {
    const missionsPerPage = this.missionsPerRow * this.rowsPerPage;

    return this.ui.View({
      style: {
        position: 'relative',
        paddingLeft: 4,
        paddingTop: 4,
        width: cardsUIContainerDimensions.width,
        height: cardsUIContainerDimensions.height,
      },
      children: [
        // Mission grid - pre-create all slots
        this.ui.View({
          style: {
            position: 'relative',
            width: '100%',
            height: '100%',
          },
          children: Array.from({ length: this.rowsPerPage }, (_, rowIndex) =>
            Array.from({ length: this.missionsPerRow }, (_, colIndex) => {
              const slotIndex = rowIndex * this.missionsPerRow + colIndex;
              return this.createMissionSlot(slotIndex, missionsPerPage, rowIndex, colIndex);
            })
          ).flat(),
        }),

        // Empty state message (only show when no missions, render on top)
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.Binding.derive([this.missions], (missions: MissionDisplay[]) => {
            return missions.length === 0 ? true : false;
          }),
          this.ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
              left: 0,
            },
            children: this.ui.Text({
              text: new this.ui.Binding('No missions available yet.'),
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                color: COLORS.textSecondary,
              },
            }),
          })
        )] : []),
      ],
    });
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
          label: 'Up',
          onClick: () => {
            // Reactive disabled state prevents invalid scrolling, so just decrement
            this.scrollOffsetValue--;
            this.scrollOffset.set(this.scrollOffsetValue);
          },
          disabled: this.ui.Binding.derive(
            [this.missions, this.scrollOffset],
            (missions, offset) => offset <= 0 ? true : false
          ) as any,
          yOffset: 0,
        },
        {
          label: 'Down',
          onClick: () => {
            // Reactive disabled state prevents invalid scrolling, so just increment
            this.scrollOffsetValue++;
            this.scrollOffset.set(this.scrollOffsetValue);
          },
          disabled: this.ui.Binding.derive(
            [this.missions, this.scrollOffset],
            (missions: MissionDisplay[], offset: number) => {
              const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(missions.length / missionsPerPage);
              return offset >= totalPages - 1 ? true : false;
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
      playerDataBinding: this.playerDataBinding,
    });
  }

  /**
   * Cleanup
   */
  dispose(): void {
    // Nothing to clean up
  }
}
