import * as hz from 'horizon/core';
import type { Player } from 'horizon/core';
import { ImageSource } from 'horizon/ui';
import type * as BB from './BloomBeasts-Types';

/**
 * HorizonPlatform - Implementation of PlatformCallbacks for Meta Horizon Worlds
 * Bridges the BloomBeasts game engine with Horizon's Custom UI
 * Supports multiplayer with per-player persistent storage
 */
export class HorizonPlatform implements BB.PlatformCallbacks {
  private ui: any;
  private world: any;
  private currentMusic: any = null;
  private musicVolume: number = 1.0;
  private sfxVolume: number = 1.0;

  constructor(ui: any, world: any) {
    this.ui = ui;
    this.world = world;
  }

  // UI Rendering
  renderStartMenu(options: string[], stats: BB.MenuStats): void {
    this.ui.showStartMenu(options, stats);
  }

  renderMissionSelect(missions: BB.MissionDisplay[], stats: BB.MenuStats): void {
    this.ui.showMissionSelect(missions, stats);
  }

  renderCards(cards: BB.CardDisplay[], deckSize: number, deckCardIds: string[], stats: BB.MenuStats): void {
    this.ui.showCards(cards, deckSize, deckCardIds, stats);
  }

  renderBattle(battleState: BB.BattleDisplay): void {
    this.ui.showBattle(battleState);
  }

  renderSettings(settings: any, stats: BB.MenuStats): void {
    this.ui.showSettings(settings, stats);
  }

  renderCardDetail(cardDetail: BB.CardDetailDisplay, stats: BB.MenuStats): void {
    this.ui.showCardDetail(cardDetail, stats);
  }

  // Input handling
  onButtonClick(callback: (buttonId: string) => void): void {
    this.ui.buttonClickCallback = callback;
  }

  onCardSelect(callback: (cardId: string) => void): void {
    this.ui.cardSelectCallback = callback;
  }

  onMissionSelect(callback: (missionId: string) => void): void {
    this.ui.missionSelectCallback = callback;
  }

  onSettingsChange(callback: (settingId: string, value: any) => void): void {
    this.ui.settingsChangeCallback = callback;
  }

  // Asset loading - returns ImageSource Props from the UI component
  async loadCardImage(cardId: string): Promise<ImageSource | null> {
    return this.ui.getCardImage(cardId);
  }

  async loadBackground(backgroundId: string): Promise<ImageSource | null> {
    return this.ui.getBackground(backgroundId);
  }

  playSound(soundId: string): void {
    this.playSfx(soundId, this.sfxVolume);
  }

  // Audio control
  playMusic(src: string, loop: boolean = true, volume: number = 1.0): void {
    this.stopMusic();
    this.musicVolume = volume;

    const audioSource = this.ui.getAudio(src);
    if (audioSource) {
      this.currentMusic = audioSource;
      // Note: Actual audio playback API may vary in Meta Horizon
      // This is a simplified implementation
      try {
        if (typeof audioSource.play === 'function') {
          audioSource.play();
        }
      } catch (e) {
        console.warn(`Could not play music: ${src}`, e);
      }
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      try {
        if (typeof this.currentMusic.stop === 'function') {
          this.currentMusic.stop();
        }
      } catch (e) {
        console.warn('Could not stop music', e);
      }
      this.currentMusic = null;
    }
  }

  playSfx(src: string, volume: number = 1.0): void {
    const audioSource = this.ui.getAudio(src);
    if (audioSource) {
      try {
        if (typeof audioSource.play === 'function') {
          audioSource.play();
        }
      } catch (e) {
        console.warn(`Could not play SFX: ${src}`, e);
      }
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume / 100));
    // Apply to current music if playing
    if (this.currentMusic && typeof this.currentMusic.setVolume === 'function') {
      this.currentMusic.setVolume(this.musicVolume);
    }
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume / 100));
  }

  // Storage - Multiplayer persistent per-player storage using world.persistentStorage
  async saveData(key: string, data: any): Promise<void> {
    try {
      if (!this.world || !this.world.persistentStorage) {
        console.warn('World persistent storage not available');
        return;
      }

      const localPlayer = this.world.getLocalPlayer();
      if (!localPlayer) {
        console.warn('No local player available for storage');
        return;
      }

      // Use world's persistent storage with per-player variables
      // This automatically handles multiplayer - each player gets their own storage
      // Note: key already includes prefix (e.g., "bloom-beasts-save")
      const storageKey = key;

      // Serialize data to JSON string for storage
      const serialized = JSON.stringify(data);

      // Save to player-specific variable (persists across sessions)
      await this.world.persistentStorage.setPlayerVariable(localPlayer, storageKey, serialized);
      console.log(`Saved player data for key: ${key}`);
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
    }
  }

  async loadData(key: string): Promise<any> {
    try {
      if (!this.world || !this.world.persistentStorage) {
        console.warn('World persistent storage not available');
        return null;
      }

      const localPlayer = this.world.getLocalPlayer();
      if (!localPlayer) {
        console.warn('No local player available for storage');
        return null;
      }

      // Load from player-specific variable (persists across sessions)
      // Note: key already includes prefix (e.g., "bloom-beasts-save")
      const storageKey = key;
      const serialized = await this.world.persistentStorage.getPlayerVariable(localPlayer, storageKey);

      if (serialized) {
        // Deserialize from JSON string
        const data = JSON.parse(serialized as string);
        console.log(`Loaded player data for key: ${key}`);
        return data;
      }
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
    }

    return null;
  }

  // Dialogs
  async showDialog(title: string, message: string, buttons?: string[]): Promise<string> {
    this.ui.showDialog(title, message, buttons || ['OK']);
    return 'OK';
  }

  async showRewards(rewards: BB.RewardDisplay): Promise<void> {
    this.ui.showRewardsPopup(rewards);
  }
}
