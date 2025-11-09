/**
 * SoundManager - Handles all audio/sound operations
 * Extracted from BloomBeastsGame to separate concerns
 */

import type { SoundSettings, PlatformConfig } from '../types';
import { Logger } from '../common/engine/utils/Logger';

/**
 * Manages all game audio (music and sound effects)
 */
export class SoundManager {
  private platform: PlatformConfig;
  private currentMusic: string | null = null;
  private settings: SoundSettings | null = null;

  constructor(platform: PlatformConfig, settings?: SoundSettings) {
    this.platform = platform;
    this.settings = settings || null;
  }

  /**
   * Update settings reference (called when settings change)
   */
  updateSettings(settings: SoundSettings): void {
    this.settings = settings;
  }

  /**
   * Play background music
   */
  playMusic(musicId: string, loop: boolean = true): void {
    // Don't restart music if it's already playing
    if (this.currentMusic === musicId) {
      return;
    }

    this.currentMusic = musicId;

    if (this.settings?.musicEnabled) {
      const volume = this.settings.musicVolume / 100;
      if (!this.platform.playSound) {
        Logger.debug('[SoundManager] playSound not implemented by platform');
      } else {
        this.platform.playSound(musicId, loop, volume);
      }
    }
  }

  /**
   * Stop background music
   */
  stopMusic(): void {
    this.currentMusic = null;
    if (!this.platform.stopSound) {
      Logger.debug('[SoundManager] stopSound not implemented by platform');
    } else {
      this.platform.stopSound();
    }
  }

  /**
   * Play sound effect
   */
  playSfx(sfxId: string): void {
    if (this.settings?.sfxEnabled) {
      const volume = this.settings.sfxVolume / 100;
      if (!this.platform.playSound) {
        Logger.debug('[SoundManager] playSound not implemented by platform');
      } else {
        this.platform.playSound(sfxId, false, volume);
      }
    }
  }

  /**
   * Set music volume (0-100)
   */
  setMusicVolume(volume: number): void {
    if (!this.settings) {
      Logger.warn('[SoundManager] Cannot set music volume: settings not initialized');
      return;
    }
    this.settings.musicVolume = Math.max(0, Math.min(100, volume));
    if (this.settings.musicEnabled) {
      if (this.platform.setMusicVolume) {
        this.platform.setMusicVolume(this.settings.musicVolume / 100);
      }
    }
  }

  /**
   * Set SFX volume (0-100)
   */
  setSfxVolume(volume: number): void {
    if (!this.settings) {
      Logger.warn('[SoundManager] Cannot set SFX volume: settings not initialized');
      return;
    }
    this.settings.sfxVolume = Math.max(0, Math.min(100, volume));
    if (this.settings.sfxEnabled) {
      if (this.platform.setSfxVolume) {
        this.platform.setSfxVolume(this.settings.sfxVolume / 100);
      }
    }
  }

  /**
   * Toggle music on/off
   */
  toggleMusic(enabled: boolean): void {
    if (!this.settings) {
      Logger.warn('[SoundManager] Cannot toggle music: settings not initialized');
      return;
    }
    this.settings.musicEnabled = enabled;

    // Notify platform
    if (this.platform.setMusicEnabled) {
      this.platform.setMusicEnabled(enabled);
    }

    if (enabled && this.currentMusic) {
      // Resume music - force replay even if it's the same track
      const musicToResume = this.currentMusic;
      const volume = this.settings.musicVolume / 100;
      if (this.platform.playSound) {
        this.platform.playSound(musicToResume, true, volume);
      }
    } else if (!enabled) {
      // Stop music playback but keep track of current music for resume
      // Don't call stopMusic() as it clears this.currentMusic
      if (this.platform.stopSound) {
        this.platform.stopSound();
      }
    }
  }

  /**
   * Toggle SFX on/off
   */
  toggleSfx(enabled: boolean): void {
    if (!this.settings) {
      Logger.warn('[SoundManager] Cannot toggle SFX: settings not initialized');
      return;
    }
    this.settings.sfxEnabled = enabled;

    // Notify platform
    if (this.platform.setSfxEnabled) {
      this.platform.setSfxEnabled(enabled);
    }
  }

  /**
   * Apply sound settings to platform
   */
  applySettings(): void {
    if (!this.settings) {
      Logger.warn('[SoundManager] Cannot apply settings: settings not initialized');
      return;
    }

    if (this.platform.setMusicVolume) {
      this.platform.setMusicVolume(this.settings.musicVolume / 100);
    }
    if (this.platform.setSfxVolume) {
      this.platform.setSfxVolume(this.settings.sfxVolume / 100);
    }
    if (this.platform.setMusicEnabled) {
      this.platform.setMusicEnabled(this.settings.musicEnabled);
    }
    if (this.platform.setSfxEnabled) {
      this.platform.setSfxEnabled(this.settings.sfxEnabled);
    }
  }

  /**
   * Get current music ID
   */
  getCurrentMusic(): string | null {
    return this.currentMusic;
  }
}
