/**
 * Mission Screen 
 */

import { GAPS, sideMenuButtonDimensions, DIMENSIONS } from '../../common/ui/styles/styles/dimensions';
import type { SimplePosition } from '../../common/ui/constants/positions';
import { missionEmoji } from '../../common/ui/constants/emojis';
import type { MissionDisplay } from '../../../bloombeasts/gameManager';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { createSideMenu, createTextRow, type SideMenuButton } from '../../common/ui/screens/SideMenu';
import { createReactiveMissionComponent, MISSION_DIMENSIONS } from '../../common/ui/screens/MissionRenderer';
import { COLORS } from '../../common/ui/styles/styles/colors';
import { BindingType, UIState } from '../../common/ui/types/types/BindingManager';
import { BaseScreen, BaseScreenProps } from '../common/BaseScreen';
import { UIStateManager } from '../common/UIStateManager';
import { ScrollButtonFactory } from '../common/ScrollButtonFactory';

const CONTAINER_DIMENSIONS = { width: 950, height: 640 };
const CONTAINER_POSITION: SimplePosition = { x: 103, y: 41 };

// Mission grid constants
const GRID_GAP_X = 12;
const GRID_GAP_Y = 12;
const GRID_START_X = 24;
const GRID_START_Y = 24;

export interface MissionScreenProps extends BaseScreenProps {
  onMissionSelect?: (missionId: string) => void;
}

interface MissionState {
  scrollOffset?: number;
}

export class MissionScreen extends BaseScreen {
  private missionsPerRow = 3;
  private rowsPerPage = 3;
  private onMissionSelect?: (missionId: string) => void;
  private stateManager: UIStateManager<MissionState>;

  constructor(props: MissionScreenProps) {
    super(props);
    this.onMissionSelect = props.onMissionSelect;
    this.stateManager = new UIStateManager<MissionState>(
      this.ui.bindingManager,
      'missions',
      this.onRenderNeeded
    );
    // Initialize scrollOffset to 0
    this.stateManager.update({ scrollOffset: 0 });
  }

  createUI(): UINodeType {
    return this.createRootContainer([
      this.createFullScreenBackground(),
      this.createMainContent(),
      this.createSideMenu(),
    ]);
  }

  private createMainContent(): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        left: CONTAINER_POSITION.x,
        top: CONTAINER_POSITION.y,
        width: CONTAINER_DIMENSIONS.width,
        height: CONTAINER_DIMENSIONS.height,
      },
      children: [
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('cards-container') || null,
          style: {
            position: 'absolute',
            width: CONTAINER_DIMENSIONS.width,
            height: CONTAINER_DIMENSIONS.height,
            top: 0,
            left: 0,
          },
        }),
        this.createMissionGrid(),
      ],
    });
  }

  private createMissionSlot(slotIndex: number, missionsPerPage: number, row: number, col: number): UINodeType {
    const cardWidth = MISSION_DIMENSIONS.width;
    const cardHeight = MISSION_DIMENSIONS.height;
    const x = GRID_START_X + col * (cardWidth + GRID_GAP_X);
    const y = GRID_START_Y + row * (cardHeight + GRID_GAP_Y);

    return this.ui.View({
      style: {
        position: 'absolute',
        left: x,
        top: y,
      },
      children: createReactiveMissionComponent(this.ui, {
        slotIndex,
        missionsPerPage,
        onClick: (missionId: string) => this.onMissionSelect?.(missionId),
      }),
    });
  }

  private createMissionGrid(): UINodeType {
    const missionsPerPage = this.missionsPerRow * this.rowsPerPage;

    return this.ui.View({
      style: {
        position: 'relative',
        paddingLeft: 4,
        paddingTop: 4,
        width: CONTAINER_DIMENSIONS.width,
        height: CONTAINER_DIMENSIONS.height,
      },
      children: [
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

        // Empty state
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
            return missions.length === 0;
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
   * Create scroll buttons using utility (eliminates 50+ lines of code)
   */
  private createScrollButtons(): SideMenuButton[] {
    const missionsPerPage = this.missionsPerRow * this.rowsPerPage;

    const getTotalPages = () => {
      const missions = this.ui.bindingManager.getSnapshot(BindingType.Missions) || [];
      return Math.ceil(missions.length / missionsPerPage);
    };

    return ScrollButtonFactory.createSideMenuScrollButtons({
      ui: this.ui,
      stateManager: this.stateManager,
      getTotalPages,
      playSfx: this.playSfx,
      playerDataBinding: false, // Mission screen watches Missions binding
    });
  }

  private createSideMenu(): UINodeType {
    const completionText = this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
      const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
      return `${missionEmoji} ${completedCount}/${missions.length}`;
    });

    return createSideMenu(this.ui, {
      title: 'Missions',
      customTextContent: [createTextRow(this.ui, completionText, 0)],
      buttons: this.createScrollButtons(),
      bottomButton: this.getBackButton(),
      playSfx: this.playSfx,
    });
  }
}
