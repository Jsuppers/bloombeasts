/**
 * CoreSystemsInitializer - Centralized core system initialization
 *
 * Extracts core system setup from BloomBeastsGame constructor.
 * Reduces god object complexity by delegating initialization logic.
 */

import { MissionManager } from '../screens/missions/MissionManager';
import { MissionSelectionUI } from '../screens/missions/MissionSelectionUI';
import { BattleUI } from '../screens/battle/BattleUI';
import { BattleDisplayManager } from '../screens/battle/BattleDisplayManager';
import { GameStateManager } from './GameStateManager';
import { SoundManager } from './SoundManager';
import { BattleRewardCalculator } from './BattleRewardCalculator';
import { UICoordinator } from './UICoordinator';
import { BattleOrchestrator } from './BattleOrchestrator';
import type { UIMethodMappings, PlatformConfig } from '../types';
import type { AsyncMethods } from '../common/ui/types/types/bindings';
import { setCatalogManagerForUtils } from '../common/utils/cardUtils';
import { setCatalogManagerForDeckBuilder } from '../common/engine/utils/deckBuilder';
import { setCatalogManagerForMissions } from '../screens/missions/utils/deckBuilder';

/**
 * Collection of all core game systems
 */
export interface CoreSystems {
  missionManager: MissionManager;
  missionUI: MissionSelectionUI;
  battleUI: BattleUI;
  battleDisplayManager: BattleDisplayManager;
  gameStateManager: GameStateManager;
  soundManager: SoundManager;
  rewardCalculator: BattleRewardCalculator;
  uiCoordinator: UICoordinator;
  battleOrchestrator: BattleOrchestrator;
}

/**
 * CoreSystemsInitializer - Initializes all core game systems
 */
export class CoreSystemsInitializer {
  /**
   * Initialize all core game systems
   */
  static initializeSystems(
    platform: PlatformConfig,
    ui: UIMethodMappings,
    asyncMethods: AsyncMethods,
    onSubmitScore: (type: 'experience' | 'cluckNorris', score: number) => void,
    onTriggerRender: () => void
  ): CoreSystems {
    // Initialize catalog manager for utilities
    setCatalogManagerForUtils(platform.catalogManager);
    setCatalogManagerForDeckBuilder(platform.catalogManager);
    setCatalogManagerForMissions(platform.catalogManager);

    // Mission systems
    const missionManager = new MissionManager(platform.catalogManager);
    const missionUI = new MissionSelectionUI(missionManager);

    // Battle systems
    const battleUI = new BattleUI(missionManager, asyncMethods);
    const battleDisplayManager = new BattleDisplayManager(platform.catalogManager);

    // Core managers
    const gameStateManager = new GameStateManager(onSubmitScore);
    const soundManager = new SoundManager(platform);
    const rewardCalculator = new BattleRewardCalculator();
    const uiCoordinator = new UICoordinator(ui.bindingManager, onTriggerRender);

    // Battle orchestrator (coordinates battle systems)
    const battleOrchestrator = new BattleOrchestrator(
      battleUI,
      battleDisplayManager,
      gameStateManager,
      rewardCalculator,
      uiCoordinator,
      soundManager,
      asyncMethods
    );

    return {
      missionManager,
      missionUI,
      battleUI,
      battleDisplayManager,
      gameStateManager,
      soundManager,
      rewardCalculator,
      uiCoordinator,
      battleOrchestrator,
    };
  }
}
