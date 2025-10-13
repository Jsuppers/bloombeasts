/**
 * Sound Manager - Handles background music and sound effects
 * Platform-independent audio management
 */

export interface SoundSettings {
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

/**
 * Platform callbacks for audio operations
 */
export interface AudioCallbacks {
  playMusic(src: string, loop: boolean, volume: number): void;
  stopMusic(): void;
  playSfx(src: string, volume: number): void;
  setMusicVolume(volume: number): void;
  setSfxVolume(volume: number): void;
}

export class SoundManager {
  private settings: SoundSettings;
  private audioCallbacks: AudioCallbacks;
  private currentMusic: string | null = null;

  constructor(audioCallbacks: AudioCallbacks) {
    this.audioCallbacks = audioCallbacks;

    // Default settings
    this.settings = {
      musicVolume: 10,
      sfxVolume: 50,
      musicEnabled: true,
      sfxEnabled: true,
    };
  }

  /**
   * Load settings from storage
   */
  loadSettings(savedSettings?: Partial<SoundSettings>): void {
    if (savedSettings) {
      this.settings = {
        ...this.settings,
        ...savedSettings,
      };
    }
  }

  /**
   * Get current settings
   */
  getSettings(): SoundSettings {
    return { ...this.settings };
  }

  /**
   * Update music volume
   */
  setMusicVolume(volume: number): void {
    this.settings.musicVolume = Math.max(0, Math.min(100, volume));
    if (this.settings.musicEnabled) {
      this.audioCallbacks.setMusicVolume(this.settings.musicVolume / 100);
    }
  }

  /**
   * Update SFX volume
   */
  setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(100, volume));
    if (this.settings.sfxEnabled) {
      this.audioCallbacks.setSfxVolume(this.settings.sfxVolume / 100);
    }
  }

  /**
   * Toggle music on/off
   */
  toggleMusic(enabled: boolean): void {
    this.settings.musicEnabled = enabled;

    if (enabled && this.currentMusic) {
      // Resume music
      this.playMusic(this.currentMusic, true);
    } else if (!enabled) {
      // Stop music
      this.audioCallbacks.stopMusic();
    }
  }

  /**
   * Toggle SFX on/off
   */
  toggleSfx(enabled: boolean): void {
    this.settings.sfxEnabled = enabled;
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

    if (this.settings.musicEnabled) {
      const volume = this.settings.musicVolume / 100;
      this.audioCallbacks.playMusic(musicId, loop, volume);
    }
  }

  /**
   * Stop background music
   */
  stopMusic(): void {
    this.currentMusic = null;
    this.audioCallbacks.stopMusic();
  }

  /**
   * Play sound effect
   */
  playSfx(sfxId: string): void {
    if (this.settings.sfxEnabled) {
      const volume = this.settings.sfxVolume / 100;
      this.audioCallbacks.playSfx(sfxId, volume);
    }
  }

  /**
   * Get current music playing
   */
  getCurrentMusic(): string | null {
    return this.currentMusic;
  }
}
