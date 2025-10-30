/**
 * Bloom Beasts Module
 * Single entry point for all Bloom Beasts functionality
 * This pattern helps work around Horizon Worlds' deep import limitations
 */

// Card constants and GameManager are already exported from their individual files
// and will be bundled into the namespace automatically

// Import types directly (not as namespaces to avoid bundling issues)
import type {
  BloomBeastCard,
  HabitatCard,
  MagicCard,
  TrapCard,
  AnyCard,
  Affinity,
  CardType,
  CounterType,
  LevelingConfig
} from './engine/types/core';

import type {
  StructuredAbility,
  AbilityEffect,
  AbilityTarget,
  EffectType
} from './engine/types/abilities';

import type {
  Level,
  StatGain,
  BloomBeastInstance
} from './engine/types/leveling';

import type {
  GameState,
  Player,
  Phase,
  GameAction
} from './engine/types/game';

// Import systems
import { AbilityProcessor } from './engine/systems/AbilityProcessor';
import { CombatSystem } from './engine/systems/CombatSystem';
import { GameEngine } from './engine/systems/GameEngine';
import { LevelingSystem } from './engine/systems/LevelingSystem';

// Import utils
import {
  isBloomBeast,
  filterByType,
  filterByAffinity,
  getBloomBeasts,
  findCardById,
  findCardByName
} from './engine/utils/cardHelpers';
import {
  buildForestDeck,
  buildFireDeck,
  buildWaterDeck,
  buildSkyDeck,
  getAllStarterDecks
} from './engine/utils/deckBuilder';
import * as CombatHelpers from './engine/utils/combatHelpers';

// Import UI components
import { StartMenuUI } from './screens/startmenu/StartMenuUI';
import { MenuController } from './screens/startmenu/MenuController';
import { MissionManager } from './screens/missions/MissionManager';
import { MissionSelectionUI } from './screens/missions/MissionSelectionUI';
import { MissionBattleUI } from './screens/missions/MissionBattleUI';

// Import mission definitions
import { missions, getMissionById, getAvailableMissions } from './screens/missions/definitions';

// Import polyfills
import { SimpleMap, arrayFrom } from './utils/polyfills';

/**
 * Main Bloombeasts module namespace
 * Contains all exports in a single flat structure
 */
export namespace Bloombeasts {
  // Note: Card constants, GameManager, and all types are already exported from their
  // individual files and will be available in the bundled namespace automatically.
  // No need to re-export them here.

  // Export system classes
  export const Systems = {
    AbilityProcessor,
    CombatSystem,
    GameEngine,
    LevelingSystem
  };

  // Export UI components
  export const UI = {
    StartMenuUI,
    MenuController,
    MissionManager,
    MissionSelectionUI,
    MissionBattleUI
  };

  // Export utility functions
  export const Utils = {
    SimpleMap,
    arrayFrom
  };

  // Export card helpers
  export const CardHelpers = {
    isBloomBeast,
    filterByType,
    filterByAffinity,
    getBloomBeasts,
    findCardById,
    findCardByName
  };

  // Export deck builders
  export const DeckBuilder = {
    buildForestDeck,
    buildFireDeck,
    buildWaterDeck,
    buildSkyDeck,
    getAllStarterDecks
  };

  // Export mission functions
  export const Missions = {
    all: missions,
    getMissionById,
    getAvailableMissions
  };

  // Platform integration types from GameManager
  export type MissionDisplay = any; // These would be imported from GameManager if it exported them
  export type CardDisplayData = any;
  export type BattleDisplay = any;
  export type RewardDisplay = any;
  export type ObjectiveDisplay = any;
  export type GameScreen = 'start-menu' | 'missions' | 'cards' | 'battle' | 'rewards';

  export interface PlatformCallbacks {
    renderStartMenu(options: string[]): void;
    renderMissionSelect(missions: MissionDisplay[]): void;
    renderCards(cards: CardDisplayData[]): void;
    renderBattle(battleState: BattleDisplay): void;
    onButtonClick(callback: (buttonId: string) => void): void;
    onCardSelect(callback: (cardId: string) => void): void;
    onMissionSelect(callback: (missionId: string) => void): void;
    loadCardImage(cardId: string): Promise<any>;
    loadBackground(backgroundId: string): Promise<any>;
    playSound(soundId: string): void;
    saveData(key: string, data: any): Promise<void>;
    loadData(key: string): Promise<any>;
    showDialog(title: string, message: string, buttons?: string[]): Promise<string>;
    showRewards(rewards: RewardDisplay): void;
  }
}

// Default export for simpler import syntax
export default Bloombeasts;