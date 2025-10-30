/**
 * Mission Renderer Component
 * Creates reactive mission cards for the mission selection screen
 */

import { COLORS } from '../../styles/colors';
import { DIMENSIONS } from '../../styles/dimensions';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import type { MissionDisplay } from '../../../../bloombeasts/gameManager';
import type { UINodeType } from '../ScreenUtils';

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
  // Source bindings (not derived)
  missionsBinding: any; // Binding<MissionDisplay[]>
  scrollOffsetBinding: any; // Binding<number>
  slotIndex: number;
  missionsPerPage: number;
  onClick?: (missionId: string) => void;
}

/**
 * Create a reactive mission component that updates based on bindings
 * Uses Horizon-compatible pattern without UINode.if() to avoid type checking errors
 */
export function createReactiveMissionComponent(ui: UIMethodMappings, props: ReactiveMissionRendererProps): UINodeType {
  const {
    missionsBinding,
    scrollOffsetBinding,
    slotIndex,
    missionsPerPage,
    onClick,
  } = props;

  // Track mission data for click handler
  let trackedMission: MissionDisplay | null = null;

  // Create dependencies array
  // ALWAYS include assetsLoadedBinding as first dependency to prevent premature asset lookups
  const dependencies = [ui.assetsLoadedBinding, missionsBinding, scrollOffsetBinding];

  // Mission card positions
  const positions = {
    name: { x: 97, y: 10 },
    image: { x: 16, y: 16 },
    level: { x: 97, y: 43 },
    difficulty: { x: 97, y: 66 },
    description: { x: 13, y: 98 },
  };

  const cardWidth = MISSION_DIMENSIONS.width;
  const cardHeight = MISSION_DIMENSIONS.height;
  const beastSize = 70;

  // Helper to get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'tutorial': return '#90EE90';
      case 'easy': return '#87CEEB';
      case 'normal': return '#FFD700';
      case 'hard': return '#FF6347';
      case 'expert': return '#8B008B';
      case 'legendary': return '#FF1493';
      default: return COLORS.textSecondary;
    }
  };

  // Create reactive bindings for all mission properties
  // args[0] = assetsLoadedBinding, args[1] = missionsBinding, args[2] = scrollOffsetBinding
  const missionNameBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;

    // Track the mission for click handler
    trackedMission = mission;

    return mission?.name || '';
  });

  const levelTextBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    return mission ? `Level ${mission.level}` : '';
  });

  const difficultyTextBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    if (!mission) return '';

    // Format difficulty nicely (capitalize first letter)
    const formattedDifficulty = mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1);
    return formattedDifficulty;
  });

  const difficultyColorBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    return mission ? getDifficultyColor(mission.difficulty) : COLORS.textSecondary;
  });

  const descriptionBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    return mission?.description || '';
  });

  const missionImageBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding
    if (!assetsLoaded) return null;
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
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

  const beastImageBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding
    if (!assetsLoaded) return null;
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;

    if (!mission || !mission.beastId) return null;

    const beastAssetId = mission.beastId.toLowerCase().replace(/\s+/g, '-');
    if (!beastAssetId) return null; // Don't try to load empty asset IDs
    return ui.assetIdToImageSource?.(beastAssetId) ?? null;
  });

  const opacityBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    return mission?.isAvailable ? 1 : 0.4;
  });

  const lockOverlayOpacityBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
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

  const checkmarkOpacityBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
    const missions: MissionDisplay[] = args[1];
    const offset: number = args[2];
    const pageStart = offset * missionsPerPage;
    const missionIndex = pageStart + slotIndex;
    const mission = missionIndex < missions.length ? missions[missionIndex] : null;
    return (mission && mission.isCompleted) ? 1 : 0;
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

    // Mission name
    ui.Text({
      text: missionNameBinding,
      numberOfLines: 1,
      style: {
        position: 'absolute',
        left: positions.name.x,
        top: positions.name.y,
        fontSize: DIMENSIONS.fontSize.xl,
        color: COLORS.textPrimary,
        fontWeight: 'bold',
      },
    }),

    // Level
    ui.Text({
      text: levelTextBinding,
      style: {
        position: 'absolute',
        left: positions.level.x,
        top: positions.level.y,
        fontSize: DIMENSIONS.fontSize.xs,
        color: COLORS.textSecondary,
      },
    }),

    // Difficulty (below level, aligned left with name and level)
    ui.Text({
      text: difficultyTextBinding,
      style: {
          position: 'absolute',
          left: positions.difficulty.x,
          top: positions.difficulty.y,
          fontSize: DIMENSIONS.fontSize.xs,
          color: difficultyColorBinding,
          fontWeight: 'bold',
        },
    }),

    // Description
    ui.Text({
      text: descriptionBinding,
      numberOfLines: 3,
      style: {
        position: 'absolute',
        left: positions.description.x,
        top: positions.description.y,
        width: cardWidth - 26,
        fontSize: DIMENSIONS.fontSize.sm,
        color: COLORS.textPrimary,
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
        text: new ui.Binding('🔒'),
        style: {
          position: 'absolute',
          left: cardWidth / 2 - 15,
          top: cardHeight / 2 - 15,
          fontSize: 30,
          color: COLORS.textPrimary,
        },
      }),
    }),

    // Completed checkmark
    ui.Text({
      text: new ui.Binding('✅'),
      style: {
        position: 'absolute',
        right: 10,
        top: 10,
        fontSize: 20,
        opacity: checkmarkOpacityBinding,
      },
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
