/**
 * Unified Settings Screen Component
 * Works on both Horizon and Web platforms
 * Matches the styling from settingsScreen.new.ts
 */

import { COLORS } from '../styles/colors';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { DIMENSIONS } from '../styles/dimensions';
import type { SoundSettings, MenuStats } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu } from './common/SideMenu';

export interface SettingsScreenProps {
  ui: UIMethodMappings;
  settings: any;
  stats: any;
  onSettingChange?: (settingId: string, value: any) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
}

/**
 * Unified Settings Screen
 */
export class SettingsScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;

  private settings: any;
  private stats: any;

  // Track binding values separately (as per Horizon docs - no .get() method)
  private settingsValue: any = {};

  private onSettingChange?: (settingId: string, value: any) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;

  constructor(props: SettingsScreenProps) {
    this.ui = props.ui;
    this.settings = props.settings;
    this.stats = props.stats;
    this.onSettingChange = props.onSettingChange;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    console.log('[SettingsScreen] constructor, onRenderNeeded:', this.onRenderNeeded ? 'defined' : 'undefined');
  }

  createUI(): UINodeType {
    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
          ),
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),
        // Cards Container image as background
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('cards-container') : null
          ),
          style: {
            position: 'absolute',
            left: 40,
            top: 40,
            width: 980,
            height: 640,
          },
        }),
        // Main content - settings panel
        // Note: UI re-renders when settings binding changes via subscription
        this.ui.View({
          style: {
            position: 'absolute',
            left: 70,
            top: 70,
            width: 920,
            height: 580,
            padding: 40,
          },
          children: [
            // Music settings (pass the binding directly)
            this.createVolumeControl('Music Volume', 'musicVolume', 'musicVolume', this.settings),
            this.createToggleControl('Music', 'musicEnabled', 'musicEnabled', this.settings),

            // SFX settings (pass the binding directly)
            this.createVolumeControl('SFX Volume', 'sfxVolume', 'sfxVolume', this.settings),
            this.createToggleControl('Sound Effects', 'sfxEnabled', 'sfxEnabled', this.settings),
          ],
        }),
        // Sidebar with common side menu
        createSideMenu(this.ui, {
          title: 'Settings',
          bottomButton: {
            label: 'Back',
            onClick: () => {
              if (this.onNavigate) this.onNavigate('menu');
            },
            disabled: false,
          },
          stats: this.stats,
        }),
      ],
    });
  }

  /**
   * Create volume control with +/- buttons
   */
  private createVolumeControl(
    label: string,
    settingKey: 'musicVolume' | 'sfxVolume',
    settingId: string,
    settingsBinding: any
  ): UINodeType {
    return this.ui.View({
      style: {
        marginBottom: 30,
      },
      children: [
        // Label and value
        this.ui.View({
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            alignItems: 'center',
          },
          children: [
            this.ui.Text({
              text: new this.ui.Binding(label),
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                color: COLORS.textPrimary,
              },
            }),
            // Volume control: - button, value, + button
            this.ui.View({
              style: {
                flexDirection: 'row',
                alignItems: 'center',
              },
              children: [
                // Decrease button
                this.ui.Pressable({
                  onClick: () => {
                    if (this.onSettingChange) {
                      const currentSettings = this.settingsValue;
                      const currentValue = currentSettings[settingKey] || 0;
                      const newValue = Math.max(0, currentValue - 10);
                      this.onSettingChange(settingId, newValue);
                    }
                  },
                  style: {
                    width: 40,
                    height: 40,
                    backgroundColor: COLORS.surface,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  },
                  children: this.ui.Text({
                    text: new this.ui.Binding('-'),
                    style: {
                      fontSize: DIMENSIONS.fontSize.xl,
                      color: COLORS.textPrimary,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    },
                  }),
                }),
                // Volume display
                this.ui.Text({
                  text: this.ui.Binding.derive(
                    [settingsBinding],
                    (settings: SoundSettings) => {
                      this.settingsValue = settings;
                      const volume = settings?.[settingKey];
                      return `${volume !== undefined && volume !== null && typeof volume === 'number' ? Math.round(volume) : 0}%`;
                    }
                  ),
                  style: {
                    fontSize: DIMENSIONS.fontSize.xl,
                    color: COLORS.success,
                    width: 70,
                    textAlign: 'center',
                  },
                }),
                // Increase button
                this.ui.Pressable({
                  onClick: () => {
                    if (this.onSettingChange) {
                      const currentSettings = this.settingsValue;
                      const currentValue = currentSettings[settingKey] || 0;
                      const newValue = Math.min(100, currentValue + 10);
                      this.onSettingChange(settingId, newValue);
                    }
                  },
                  style: {
                    width: 40,
                    height: 40,
                    backgroundColor: COLORS.surface,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 15,
                  },
                  children: this.ui.Text({
                    text: new this.ui.Binding('+'),
                    style: {
                      fontSize: DIMENSIONS.fontSize.xl,
                      color: COLORS.textPrimary,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    },
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Create toggle button control
   */
  private createToggleControl(
    label: string,
    settingKey: 'musicEnabled' | 'sfxEnabled',
    settingId: string,
    settingsBinding: any
  ): UINodeType {
    return this.ui.View({
      style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
      },
      children: [
        this.ui.Text({
          text: new this.ui.Binding(label),
          style: {
            fontSize: DIMENSIONS.fontSize.xl,
            color: COLORS.textPrimary,
          },
        }),

        // Toggle button
        this.ui.Pressable({
          onClick: () => {
            console.log(`[SettingsScreen] Toggle clicked - settingKey: ${settingKey}, settingId: ${settingId}`);
            if (this.onSettingChange) {
              const currentSettings = this.settingsValue;
              console.log(`[SettingsScreen] Current settings:`, currentSettings);
              const currentValue = currentSettings[settingKey];
              const newValue = !currentValue;
              console.log(`[SettingsScreen] Toggle value: ${currentValue} -> ${newValue}`);

              // Just call the callback - let the parent handle updating the binding
              // The binding update will trigger a re-render automatically
              this.onSettingChange(settingId, newValue);
            }
          },
          style: {
            position: 'relative',
            width: 120,
            height: 40,
          },
          children: [
            // Button background image (standard or green based on state)
            this.ui.Image({
              source: this.ui.Binding.derive(
                [settingsBinding],
                (settings: SoundSettings) => this.ui.assetIdToImageSource?.(settings[settingKey] ? 'green-button' : 'standard-button') ?? null
              ),
              style: {
                position: 'absolute',
                width: 120,
                height: 40,
              },
            }),
            // Button text centered
            this.ui.View({
              style: {
                position: 'absolute',
                width: 120,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: this.ui.Binding.derive(
                  [settingsBinding],
                  (settings: SoundSettings) => settings[settingKey] ? 'ON' : 'OFF'
                ),
                style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  color: COLORS.textPrimary,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textAlignVertical: 'center',
                },
              }),
            }),
          ],
        }),
      ],
    });
  }

  dispose(): void {
    // Cleanup
  }
}
