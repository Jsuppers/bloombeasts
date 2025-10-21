import * as hz from 'horizon/core';
import type { Player } from 'horizon/core';
import type * as BB from './BloomBeasts-Types';

/**
 * HorizonPlatform - Simplified implementation using Persistent Variables v2
 * This bridges the BloomBeasts game engine with Horizon Worlds
 * All state is stored in PlayerData with localState for UI navigation
 */
export class HorizonPlatform implements BB.PlatformCallbacks {
  private ui: any;
  private world: any; // Use 'any' for world to avoid type issues
  private playerData: BB.PlayerData;
  private currentPlayer: Player | null = null;

  constructor(ui: any, world: any) {
    this.ui = ui;
    this.world = world;
    // Initialize with default data immediately - will be overwritten if saved data exists
    this.playerData = this.getDefaultPlayerData();
  }

  // Initialize and load player data
  async initialize(): Promise<void> {
    try {
      console.log('Platform initialize called');
      console.log('  World type:', typeof this.world);
      console.log('  World.getLocalPlayer:', typeof this.world.getLocalPlayer);
      console.log('  World.persistentStorage:', !!this.world.persistentStorage);

      // Try different ways to get the player
      try {
        if (typeof this.world.getLocalPlayer === 'function') {
          this.currentPlayer = await this.world.getLocalPlayer();
          console.log('Got player via getLocalPlayer():', !!this.currentPlayer);
        } else if (this.world.localPlayer) {
          this.currentPlayer = this.world.localPlayer;
          console.log('Got player via world.localPlayer');
        } else if ((this.world as any).player) {
          this.currentPlayer = (this.world as any).player;
          console.log('Got player via world.player');
        } else {
          console.log('Warning: Could not get local player, using mock mode');
        }
      } catch (e) {
        console.error('Error getting player:', e);
      }

      console.log('Current player retrieved:', !!this.currentPlayer);

      if (!this.currentPlayer) {
        console.warn('No local player found - using default player data in mock mode');
        // playerData already initialized in constructor
        this.ui.setPlayerData(this.playerData);
        return;
      }

      // Load player data using persistent variables v2
      await this.loadPlayerData();

      console.log('Platform initialize complete. PlayerData:', {
        hasPlayerData: !!this.playerData,
        hasLocalState: !!this.playerData.localState,
        currentScreen: this.playerData.localState.currentScreen,
        cardsCollected: this.playerData.cards.collected.length
      });

      // Set up UI with loaded data (or default from constructor)
      this.ui.setPlayerData(this.playerData);
    } catch (error) {
      console.error('Failed to initialize platform:', error);
      // playerData already has default values from constructor
      this.ui.setPlayerData(this.playerData);
    }
  }

  // Get default player data
  private getDefaultPlayerData(): BB.PlayerData {
    return {
      name: 'Player',
      level: 1,
      totalXP: 0,
      cards: {
        collected: [],
        deck: []
      },
      missions: {
        completedMissions: {}
      },
      tokens: 100, // Start with some tokens
      diamonds: 0,
      serums: 0,
      localState: {
        currentScreen: 'menu',
        volume: 80,
        sfxVolume: 80,
        cardsPageOffset: 0
      }
    };
  }

  // Load player data using persistent variables v2
  private async loadPlayerData(): Promise<void> {
    try {
      if (!this.currentPlayer) {
        console.log('No current player found');
        return;
      }

      console.log('Loading player data for player');

      // Persistent Variables v2 API
      // Variable key format: "variableGroupName:variableName"
      // Note: Variable group and variable must be created in Desktop Editor first
      const varGroupName = 'BloomBeastsData';
      const varName = 'playerData';
      const varKey = `${varGroupName}:${varName}`;

      let data = null;

      // Use the correct Horizon Persistent Variables v2 API
      if (this.world.persistentStorage) {
        try {
          console.log('Loading via world.persistentStorage.getPlayerVariable()...');
          const result = this.world.persistentStorage.getPlayerVariable(this.currentPlayer, varKey);

          // getPlayerVariable returns 0 if variable hasn't been set
          if (result === 0) {
            console.log('No saved data found (default value 0)');
            data = null;
          } else {
            // Cast to object
            data = result as object;
            console.log('Player data loaded successfully');
          }
        } catch (e) {
          console.error('Failed to load player data:', e);
        }
      } else {
        console.warn('persistentStorage API not available');
      }

      console.log('Final loaded data:', !!data);

      if (data) {
        this.playerData = data as BB.PlayerData;

        // Ensure localState exists (for migration)
        if (!this.playerData.localState) {
          this.playerData.localState = {
            currentScreen: 'menu',
            volume: 80,
            sfxVolume: 80,
            cardsPageOffset: 0
          };
        }

        // Ensure resource fields exist
        if (this.playerData.tokens === undefined) this.playerData.tokens = 100;
        if (this.playerData.diamonds === undefined) this.playerData.diamonds = 0;
        if (this.playerData.serums === undefined) this.playerData.serums = 0;

        console.log('Player data loaded successfully');
      } else {
        // No saved data - leave playerData as null, caller will create default
        console.log('No saved data found - caller should create default data');
        // Don't set to null here - let initialize() handle it
      }
    } catch (error) {
      console.error('Failed to load player data:', error);
      // Don't set to null here - let initialize() handle it
    }
  }

  // Save player data using persistent variables v2
  private async savePlayerData(): Promise<void> {
    try {
      console.log('Saving player data...');

      // Persistent Variables v2 API
      const varGroupName = 'BloomBeastsData';
      const varName = 'playerData';
      const varKey = `${varGroupName}:${varName}`;

      let saved = false;

      // Use the correct Horizon Persistent Variables v2 API
      if (this.currentPlayer && this.world.persistentStorage) {
        try {
          this.world.persistentStorage.setPlayerVariable(
            this.currentPlayer,
            varKey,
            this.playerData
          );
          console.log('Player data saved successfully');
          saved = true;
        } catch (e) {
          console.error('Failed to save player data:', e);
        }
      }

      if (!saved) {
        console.log('[INFO] Persistent storage not available - data will reset on reload');
        console.log('  Make sure you have created the variable group "BloomBeastsData"');
        console.log('  and variable "playerData" (Object type) in Desktop Editor');
      }

      // Always update UI immediately (most important part)
      this.ui.setPlayerData(this.playerData);
    } catch (error) {
      console.log('[INFO] Could not save to persistent storage:', error);
      // Still update UI even if save fails
      this.ui.setPlayerData(this.playerData);
    }
  }

  // Update local state (UI navigation, settings, etc.)
  async updateLocalState(updates: Partial<BB.LocalState>): Promise<void> {
    this.playerData.localState = {
      ...this.playerData.localState,
      ...updates
    };

    await this.savePlayerData();
  }

  // Navigate to a screen
  async navigateToScreen(screen: BB.LocalState['currentScreen']): Promise<void> {
    await this.updateLocalState({ currentScreen: screen });
  }

  // ============= Public API =============

  setPlayerData(data: BB.PlayerData): void {
    console.log('Platform.setPlayerData called with:', {
      cardsCollected: data.cards.collected.length,
      deckSize: data.cards.deck.length,
      hasLocalState: !!data.localState
    });
    this.playerData = data;
    this.ui.setPlayerData(data);
  }

  // ============= UI Rendering Methods =============

  renderStartMenu(options: string[], stats: BB.MenuStats): void {
    this.updateLocalState({ currentScreen: 'menu' });
  }

  renderMissionSelect(missions: BB.MissionDisplay[], stats: BB.MenuStats): void {
    this.updateLocalState({ currentScreen: 'missions' });
  }

  renderCards(cards: BB.CardDisplay[], deckSize: number, deckCardIds: string[], stats: BB.MenuStats): void {
    // Update cards data
    this.playerData.cards.deck = deckCardIds;

    // Navigate to cards screen
    this.updateLocalState({ currentScreen: 'cards' });
  }

  renderBattle(battleState: BB.BattleDisplay): void {
    this.updateLocalState({ currentScreen: 'battle' });
  }

  renderSettings(settings: any, stats: BB.MenuStats): void {
    this.updateLocalState({ currentScreen: 'settings' });
  }

  renderCardDetail(cardDetail: BB.CardDetailDisplay, stats: BB.MenuStats): void {
    // Card detail is shown as an overlay, not a screen change
    this.ui.showCardDetail(cardDetail);
  }

  // ============= Input Callbacks =============

  onButtonClick(callback: (buttonId: string) => void): void {
    this.ui.onButtonClick = async (buttonId: string) => {
      // Handle navigation buttons
      switch (buttonId) {
        case 'btn-missions':
          await this.navigateToScreen('missions');
          break;
        case 'btn-cards':
          await this.navigateToScreen('cards');
          break;
        case 'btn-settings':
          await this.navigateToScreen('settings');
          break;
        case 'btn-menu':
          await this.navigateToScreen('menu');
          break;
      }

      // Call the game engine callback
      callback(buttonId);
    };
  }

  onCardSelect(callback: (cardId: string) => void): void {
    this.ui.onCardSelect = async (cardId: string) => {
      await this.updateLocalState({ selectedCardId: cardId });
      callback(cardId);
    };
  }

  onMissionSelect(callback: (missionId: string) => void): void {
    this.ui.onMissionSelect = async (missionId: string) => {
      await this.updateLocalState({ selectedMissionId: missionId });
      callback(missionId);
    };
  }

  onSettingsChange(callback: (settingId: string, value: any) => void): void {
    this.ui.onSettingsChange = async (settingId: string, value: any) => {
      // Update local state for volume settings
      if (settingId === 'volume') {
        await this.updateLocalState({ volume: value });
      } else if (settingId === 'sfxVolume') {
        await this.updateLocalState({ sfxVolume: value });
      }

      callback(settingId, value);
    };
  }

  // ============= Asset Loading =============

  async loadCardImage(cardId: string): Promise<any> {
    return this.ui.getCardImage(cardId);
  }

  async loadBackground(backgroundId: string): Promise<any> {
    return this.ui.getBackground(backgroundId);
  }

  // ============= Audio =============

  playSound(soundId: string): void {
    const volume = this.playerData.localState.sfxVolume / 100;
    this.playSfx(soundId, volume);
  }

  playMusic(src: string, loop: boolean = true, volume?: number): void {
    const musicVolume = volume ?? (this.playerData.localState.volume / 100);
    this.ui.playMusic(src, loop, musicVolume);
  }

  stopMusic(): void {
    this.ui.stopMusic();
  }

  playSfx(src: string, volume?: number): void {
    const sfxVolume = volume ?? (this.playerData.localState.sfxVolume / 100);
    this.ui.playSfx(src, sfxVolume);
  }

  setMusicVolume(volume: number): void {
    this.updateLocalState({ volume });
  }

  setSfxVolume(volume: number): void {
    this.updateLocalState({ sfxVolume: volume });
  }

  // ============= Storage (using PlayerData) =============

  async saveData(key: string, data: any): Promise<void> {
    // In this simplified version, all data goes through PlayerData
    // For specific game saves, update the playerData directly
    if (key === 'bloom-beasts-save' && data.playerData) {
      this.playerData = {
        ...this.playerData,
        ...data.playerData,
        localState: this.playerData.localState // Preserve localState
      };
      await this.savePlayerData();
    }
  }

  async loadData(key: string): Promise<any> {
    // Return current playerData for game saves
    if (key === 'bloom-beasts-save') {
      return {
        playerData: this.playerData
      };
    }
    return null;
  }

  // ============= Dialogs =============

  async showDialog(title: string, message: string, buttons?: string[]): Promise<string> {
    return this.ui.showDialog(title, message, buttons || ['OK']);
  }

  async showRewards(rewards: BB.RewardDisplay): Promise<void> {
    this.ui.showRewardsPopup(rewards);
  }

  // ============= Utility Methods =============

  getPlayerData(): BB.PlayerData {
    return this.playerData;
  }

  async updatePlayerResources(tokens?: number, diamonds?: number, serums?: number): Promise<void> {
    if (tokens !== undefined) this.playerData.tokens = tokens;
    if (diamonds !== undefined) this.playerData.diamonds = diamonds;
    if (serums !== undefined) this.playerData.serums = serums;

    await this.savePlayerData();
  }

  async addXP(amount: number): Promise<void> {
    this.playerData.totalXP += amount;

    // Calculate new level based on XP thresholds
    const XP_THRESHOLDS = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
    let newLevel = 1;
    for (let i = 1; i < XP_THRESHOLDS.length; i++) {
      if (this.playerData.totalXP >= XP_THRESHOLDS[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }

    this.playerData.level = Math.min(newLevel, 9); // Max level 9

    await this.savePlayerData();
  }
}