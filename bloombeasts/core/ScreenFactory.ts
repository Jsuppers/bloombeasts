/**
 * ScreenFactory - Centralized screen creation
 *
 * Extracts screen instantiation logic from BloomBeastsGame.
 * Reduces god object complexity and centralizes screen configuration.
 */

import { MenuScreen } from '../screens/menu/MenuScreen';
import { CardsScreen } from '../screens/cards/CardsScreen';
import { UpgradeScreen } from '../screens/upgrade/UpgradeScreen';
import { MissionScreen } from '../screens/missions/MissionScreen';
import { BattleScreen } from '../screens/battle/BattleScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { LeaderboardScreen } from '../screens/leaderboard/LeaderboardScreen';
import type { UIMethodMappings } from '../types';
import type { AsyncMethods } from '../common/ui/types/types/bindings';

/**
 * Screen factory configuration - all dependencies needed for screen creation
 */
export interface ScreenFactoryConfig {
  ui: UIMethodMappings;
  asyncMethods: AsyncMethods;

  // Event handlers
  onButtonClick: (buttonId: string) => Promise<void>;
  onCardSelect: (cardId: string) => Promise<void>;
  onMissionSelect: (missionId: string) => Promise<void>;
  onSettingChange: (settingId: string, value: any) => void;
  onUpgrade: (boostId: string) => void;
  onBattleAction: (action: string) => Promise<void>;
  onNavigate: (screen: string) => void;
  onShowCardDetail: (card: any, durationMs: number, callback?: () => void) => void;

  // Utilities
  onRenderNeeded: () => void;
  playSfx: (sfxId: string) => void;
}

/**
 * All game screens
 */
export interface GameScreens {
  menuScreen: MenuScreen;
  cardsScreen: CardsScreen;
  upgradeScreen: UpgradeScreen;
  missionScreen: MissionScreen;
  battleScreen: BattleScreen;
  settingsScreen: SettingsScreen;
  leaderboardScreen: LeaderboardScreen;
}

/**
 * ScreenFactory - Creates all game screens with proper configuration
 */
export class ScreenFactory {
  /**
   * Create all game screens
   */
  static createScreens(config: ScreenFactoryConfig): GameScreens {
    const {
      ui,
      asyncMethods,
      onButtonClick,
      onCardSelect,
      onMissionSelect,
      onSettingChange,
      onUpgrade,
      onBattleAction,
      onNavigate,
      onShowCardDetail,
      onRenderNeeded,
      playSfx,
    } = config;

    return {
      menuScreen: new MenuScreen({
        ui,
        onButtonClick,
        onNavigate,
        onRenderNeeded,
        playSfx,
      }),

      cardsScreen: new CardsScreen({
        ui,
        onCardSelect,
        onNavigate,
        onRenderNeeded,
        playSfx,
      }),

      upgradeScreen: new UpgradeScreen({
        ui,
        onNavigate,
        onUpgrade,
        onRenderNeeded,
        playSfx,
      }),

      missionScreen: new MissionScreen({
        ui,
        onMissionSelect,
        onNavigate,
        onRenderNeeded,
        playSfx,
      }),

      battleScreen: new BattleScreen({
        ui,
        async: asyncMethods,
        onAction: onBattleAction,
        onNavigate,
        onRenderNeeded,
        onShowCardDetail,
        playSfx,
      }),

      settingsScreen: new SettingsScreen({
        ui,
        onSettingChange,
        onNavigate,
        onRenderNeeded,
        playSfx,
      }),

      leaderboardScreen: new LeaderboardScreen({
        ui,
        onNavigate,
        playSfx,
      }),
    };
  }
}
