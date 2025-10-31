/**
 * Mission Renderer Component
 * Creates reactive mission cards for the mission selection screen
 */

import { COLORS } from '../../styles/colors';
import { DIMENSIONS } from '../../styles/dimensions';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import type { MissionDisplay } from '../../../../bloombeasts/gameManager';
import type { UINodeType } from '../ScreenUtils';
import { BindingType, UIState } from '../../types/BindingManager';

/**
 * Mission card dimensions
 */
export const MISSION_DIMENSIONS = {
  width: 290,
  height: 185,
};

/**
 * Props for reactive mission component
 */
export interface ReactiveMissionRendererProps {
  slotIndex: number;
  missionsPerPage: number;
  onClick?: (missionId: string) => void;
}

/**
 * Create a reactive mission component that updates based on bindings
 */
export function createReactiveMissionComponent(ui: UIMethodMappings, props: ReactiveMissionRendererProps): UINodeType {
  const {
    slotIndex,
    missionsPerPage,
    onClick,
  } = props;

  // Track mission data for click handler
  let trackedMission: MissionDisplay | null = null;

  // Mission card positions
  const positions = {
    image: { x: 16, y: 16 },
    text: { x: 97, y: 10 },
  };

  const cardWidth = MISSION_DIMENSIONS.width;
  const cardHeight = MISSION_DIMENSIONS.height;
  const beastSize = 70;

  // Create a single binding for all text content
  const missionTextBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
    const offset: number = uiState.missions?.scrollOffset ?? 0;
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;

    // Track the mission for click handler
    trackedMission = mission;

    if (!mission) return '';

    // Format difficulty nicely (capitalize first letter)
    const formattedDifficulty = mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1);

    // Add completion indicator if mission is completed
    const completionIndicator = mission.isCompleted ? '✓ ' : '';

    // Combine all text with line breaks
    return `${completionIndicator}${mission.name}\nLevel ${mission.level} - ${formattedDifficulty}\n\n${mission.description}`;
  });

  const missionImageBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
    const offset: number = uiState.missions?.scrollOffset ?? 0;
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;

    if (!mission) return null;

    // Determine mission background image based on affinity
    let missionImageName = 'forest-mission';
    if (mission.affinity === 'Water') missionImageName = 'water-mission';
    else if (mission.affinity === 'Fire') missionImageName = 'fire-mission';
    else if (mission.affinity === 'Sky') missionImageName = 'sky-mission';
    else if (mission.affinity === 'Boss') missionImageName = 'boss-mission';

    return ui.assetIdToImageSource?.(missionImageName) ?? null;
  });

  const beastImageBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
    const offset: number = uiState.missions?.scrollOffset ?? 0;
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;

    if (!mission || !mission.beastId) return null;

    const beastAssetId = mission.beastId.toLowerCase().replace(/\s+/g, '-');
    if (!beastAssetId) return null; // Don't try to load empty asset IDs
    return ui.assetIdToImageSource?.(beastAssetId) ?? null;
  });

  const opacityBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
    const offset: number = uiState.missions?.scrollOffset ?? 0;
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    return mission?.isAvailable ? 1 : 0.4;
  });

  const lockOverlayOpacityBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
    const offset: number = uiState.missions?.scrollOffset ?? 0;
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    const lockOpacity = (mission && !mission.isAvailable) ? 1 : 0;

    // Debug log for first 3 slots
    if (slotIndex < 3 && mission) {
      console.log(`[MissionRenderer] Slot ${slotIndex} (${mission.id}): isAvailable=${mission.isAvailable}, lockOpacity=${lockOpacity}`);
    }

    return lockOpacity;
  });

  // Render all layers - use opacity to hide/show
  const children = [
    // Mission background image
    ui.Image({
      source: missionImageBinding,
      style: {
        position: 'absolute',
        width: cardWidth,
        height: cardHeight,
        top: 0,
        left: 0,
      },
    }),

    // Beast image
    ui.Image({
      source: beastImageBinding,
      style: {
        position: 'absolute',
        width: beastSize,
        height: beastSize,
        left: positions.image.x,
        top: positions.image.y,
        opacity: opacityBinding,
      },
    }),

    // All mission text (name, level, difficulty, description)
    ui.Text({
      text: missionTextBinding,
      numberOfLines: 8,
      style: {
        position: 'absolute',
        left: positions.text.x,
        top: positions.text.y,
        width: cardWidth - positions.text.x - 10,
        fontSize: DIMENSIONS.fontSize.sm,
        color: COLORS.textPrimary,
        lineHeight: 16,
      },
    }),

    // Lock overlay (for unavailable missions)
    ui.View({
      style: {
        position: 'absolute',
        width: cardWidth,
        height: cardHeight,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        opacity: lockOverlayOpacityBinding,
      },
      children: ui.Text({
        text: '🔒',
        style: {
          position: 'absolute',
          left: cardWidth / 2 - 15,
          top: cardHeight / 2 - 15,
          fontSize: 30,
          color: COLORS.textPrimary,
        },
      }),
    }),
  ];

  // Wrap in pressable container
  return ui.Pressable({
    onClick: () => {
      if (trackedMission && trackedMission.isAvailable && onClick) {
        onClick(trackedMission.id);
      }
    },
    style: {
      width: cardWidth,
      height: cardHeight,
      position: 'relative',
      opacity: opacityBinding,
    },
    children: children.filter(child => child !== undefined && child !== null),
  });
}
