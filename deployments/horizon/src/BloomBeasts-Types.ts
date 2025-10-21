/**
 * Shared TypeScript type definitions for BloomBeasts
 * Used by both BloomBeasts-GamePlatform and BloomBeasts-Game
 */

export interface PlatformCallbacks {
  setPlayerData(data: PlayerData): void;
  getPlayerData?(): PlayerData;
  renderStartMenu(options: string[], stats: MenuStats): void;
  renderMissionSelect(missions: MissionDisplay[], stats: MenuStats): void;
  renderCards(cards: CardDisplay[], deckSize: number, deckCardIds: string[], stats: MenuStats): void;
  renderBattle(battleState: BattleDisplay): void;
  renderSettings(settings: any, stats: MenuStats): void;
  renderCardDetail(cardDetail: CardDetailDisplay, stats: MenuStats): void;
  onButtonClick(callback: (buttonId: string) => void): void;
  onCardSelect(callback: (cardId: string) => void): void;
  onMissionSelect(callback: (missionId: string) => void): void;
  onSettingsChange(callback: (settingId: string, value: any) => void): void;
  loadCardImage(cardId: string): Promise<any>;
  loadBackground(backgroundId: string): Promise<any>;
  playSound(soundId: string): void;
  playMusic(src: string, loop: boolean, volume: number): void;
  stopMusic(): void;
  playSfx(src: string, volume: number): void;
  setMusicVolume(volume: number): void;
  setSfxVolume(volume: number): void;
  saveData(key: string, data: any): Promise<void>;
  loadData(key: string): Promise<any>;
  showDialog(title: string, message: string, buttons?: string[]): Promise<string>;
  showRewards(rewards: RewardDisplay): Promise<void>;
}

export interface MenuStats {
  playerLevel: number;
  totalXP: number;
  tokens: number;
  diamonds: number;
  serums: number;
}

export interface MissionDisplay {
  id: string;
  name: string;
  level: number;
  difficulty: string;
  isCompleted: boolean;
  isAvailable: boolean;
}

export interface CardDisplay {
  id: string;
  name: string;
  affinity: string;
  baseAttack?: number;
  baseHealth?: number;
}

export interface BattleDisplay {
  // Battle state properties
}

export interface CardDetailDisplay {
  // Card detail properties
}

export interface RewardDisplay {
  message: string;
  // Other reward properties
}

export interface GameManager {
  new (platform: PlatformCallbacks): GameManager;
  initialize(): Promise<void>;
}

// Extended PlayerData interface with local UI state
export interface LocalState {
  currentScreen: 'menu' | 'missions' | 'cards' | 'battle' | 'settings';
  volume: number;
  sfxVolume: number;
  cardsPageOffset: number;
  selectedMissionId?: string;
  selectedCardId?: string;
}

export interface PlayerData {
  // Core player data (persisted)
  name: string;
  level: number;
  totalXP: number;

  // Card collection and deck
  cards: {
    collected: any[];
    deck: string[];
  };

  // Mission progress
  missions: {
    completedMissions: { [missionId: string]: number };
  };

  // Player resources
  tokens: number;
  diamonds: number;
  serums: number;

  // Local UI state (also persisted per-player)
  localState: LocalState;
}
