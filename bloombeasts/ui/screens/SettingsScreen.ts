/**
 * Unified Settings Screen Component
 * Works on both Horizon and Web platforms
 * Matches the styling from settingsScreen.new.ts
 */

import { COLORS } from '../styles/colors';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { DIMENSIONS } from '../styles/dimensions';
import type { SoundSettings } from '../../../bloombeasts/systems/SoundManager';
import type { MenuStats } from '../../../bloombeasts/gameManager';
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
            this.createVolumeControl('Music Volume', 'musicVolume', 'music-volume', this.settings),
            this.createToggleControl('Music', 'musicEnabled', 'music-enabled', this.settings),

            // SFX settings (pass the binding directly)
            this.createVolumeControl('SFX Volume', 'sfxVolume', 'sfx-volume', this.settings),
            this.createToggleControl('Sound Effects', 'sfxEnabled', 'sfx-enabled', this.settings),
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
   * Create volume control slider
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
          },
          children: [
            this.ui.Text({
              text: new this.ui.Binding(label),
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                color: COLORS.textPrimary,
              },
            }),
            this.ui.Text({
              text: this.ui.Binding.derive(
                [settingsBinding],
                (settings: SoundSettings) => {
                  // Update tracked value whenever settings changes
                  this.settingsValue = settings;
                  return `${settings[settingKey]}%`;
                }
              ),
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                color: COLORS.success,
              },
            }),
          ],
        }),

        // Slider
        this.ui.Pressable({
          onClick: (relativeX?: number) => {
            if (relativeX !== undefined && this.onSettingChange) {
              // Convert relative position (0-1) to volume (0-100)
              const newValue = Math.round(relativeX * 100);
              const clampedValue = Math.max(0, Math.min(100, newValue));
              this.onSettingChange(settingId, clampedValue);

              // Update the binding immediately for responsive UI
              const currentSettings = this.settingsValue;
              const newSettings = {
                ...currentSettings,
                [settingKey]: clampedValue,
              };
              this.settingsValue = newSettings;
              this.settings.set(newSettings);

              // Trigger re-render after updating settings
              console.log('[SettingsScreen] Slider changed, onRenderNeeded:', this.onRenderNeeded ? 'calling' : 'undefined');
              if (this.onRenderNeeded) {
                this.onRenderNeeded();
              }
            }
          },
          style: {
            width: 400,
            height: 30,
            backgroundColor: '#333',
            borderRadius: 5,
            position: 'relative',
          },
          children: [
            // Fill
            this.ui.View({
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                width: this.ui.Binding.derive(
                  [settingsBinding],
                  (settings: SoundSettings) => `${settings[settingKey]}%`
                ),
                height: '100%',
                backgroundColor: COLORS.success,
                borderRadius: 5,
              },
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
            if (this.onSettingChange) {
              const currentSettings = this.settingsValue;
              const currentValue = currentSettings[settingKey];
              const newValue = !currentValue;
              this.onSettingChange(settingId, newValue);

              // Update the binding immediately for responsive UI
              const newSettings = {
                ...currentSettings,
                [settingKey]: newValue,
              };
              this.settingsValue = newSettings;
              this.settings.set(newSettings);

              // Trigger re-render after updating settings
              console.log('[SettingsScreen] Toggle changed, onRenderNeeded:', this.onRenderNeeded ? 'calling' : 'undefined');
              if (this.onRenderNeeded) {
                this.onRenderNeeded();
              }
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
