/**
 * Mission Screen - Refactored with UI Component System
 */

import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { GAPS } from '../styles/dimensions';
import { sideMenuButtonDimensions } from '../constants/dimensions';
import type { SimplePosition } from '../constants/positions';
import { missionEmoji } from '../constants/emojis';
import type { MissionDisplay } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';
import { createReactiveMissionComponent, MISSION_DIMENSIONS } from './common/MissionRenderer';
import { COLORS } from '../styles/colors';
import { DIMENSIONS } from '../styles/dimensions';
import { BindingType, UIState } from '../types/BindingManager';

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
  onMissionSelect?: (missionId: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
  playSfx?: (sfxId: string) => void;
}

/**
 * Unified Mission Screen that works on both platforms
 */
export class MissionScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;

  // Configuration
  private missionsPerRow: number = 3;
  private rowsPerPage: number = 3;

  // Callbacks
  private onMissionSelect?: (missionId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;
  private playSfx?: (sfxId: string) => void;

  constructor(props: MissionScreenProps) {
    this.ui = props.ui;
    this.onMissionSelect = props.onMissionSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.playSfx = props.playSfx;
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
      source: this.ui.assetIdToImageSource?.('background') || null,
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
          source: this.ui.assetIdToImageSource?.('cards-container') || null,
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
   * Create the mission grid using single binding (Horizon-compatible)
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
          this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
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
              text: 'No missions available yet.',
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
    const completionText = this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
      const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
      return `${missionEmoji} ${completedCount}/${missions.length}`;
    });

    return createSideMenu(this.ui, {
      title: 'Missions',
      customTextContent: [
        createTextRow(this.ui, completionText as any, 0),
      ],
      buttons: [
        {
          label: 'Previous',
          onClick: () => {
            const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            // Reactive disabled state prevents invalid scrolling, so just decrement
            this.ui.bindingManager.setBinding(BindingType.UIState, {
              ...currentState,
              missions: {
                ...currentState.missions,
                scrollOffset: (currentState.missions?.scrollOffset ?? 0) - 1
              }
            });
            this.onRenderNeeded?.();
          },
          disabled: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
            const offset: number = uiState.missions?.scrollOffset ?? 0;
            return offset <= 0 ? true : false;
          }),
          opacity: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
            const offset: number = uiState.missions?.scrollOffset ?? 0;
            return offset <= 0 ? 0.5 : 1.0;
          }),
          textColor: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
            const offset: number = uiState.missions?.scrollOffset ?? 0;
            return offset <= 0 ? '#888' : '#fff';
          }),
          yOffset: 0,
        },
        {
          label: 'Next',
          onClick: () => {
            const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            // Reactive disabled state prevents invalid scrolling, so just increment
            this.ui.bindingManager.setBinding(BindingType.UIState, {
              ...currentState,
              missions: {
                ...currentState.missions,
                scrollOffset: (currentState.missions?.scrollOffset ?? 0) + 1
              }
            });
            this.onRenderNeeded?.();
          },
          disabled: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
            const offset: number = uiState.missions?.scrollOffset ?? 0;
            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(missions.length / missionsPerPage);
            return offset >= totalPages - 1 ? true : false;
          }),
          opacity: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
            const offset: number = uiState.missions?.scrollOffset ?? 0;
            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(missions.length / missionsPerPage);
            return offset >= totalPages - 1 ? 0.5 : 1.0;
          }),
          textColor: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
            const offset: number = uiState.missions?.scrollOffset ?? 0;
            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(missions.length / missionsPerPage);
            return offset >= totalPages - 1 ? '#888' : '#fff';
          }),
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
      playSfx: this.playSfx,
    });
  }

  /**
   * Cleanup
   */
  dispose(): void {
    // Nothing to clean up
  }
}
