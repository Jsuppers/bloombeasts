/**
 * Settings Screen - Refactored using BaseScreen
 *
 * Reduced by eliminating constructor boilerplate and layout duplication
 */

import { COLORS } from '../../common/ui/styles/styles/colors';
import { DIMENSIONS } from '../../common/ui/styles/styles/dimensions';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { createSideMenu } from '../../common/ui/screens/SideMenu';
import { BindingType } from '../../common/ui/types/types/BindingManager';
import { BaseScreen, BaseScreenProps } from '../common/BaseScreen';

// Settings constants
const VOLUME_DEFAULT = 50;
const VOLUME_MIN = 0;
const VOLUME_MAX = 100;
const VOLUME_STEP = 10;

// UI constants
const BUTTON_SIZE = 40;
const TOGGLE_WIDTH = 80;
const TOGGLE_HEIGHT = 40;
const CONTROL_MARGIN_BOTTOM = 30;
const BUTTON_MARGIN = 10;

// Color constants (for controls not in COLORS)
const CONTROL_BUTTON_BG = '#333';
const TOGGLE_ON_COLOR = '#4CAF50';
const TOGGLE_OFF_COLOR = '#888';

/**
 * Settings data structure
 */
export interface Settings {
  musicVolume?: number;
  sfxVolume?: number;
  musicEnabled?: boolean;
  sfxEnabled?: boolean;
}

export interface SettingsScreenProps extends BaseScreenProps {
  onSettingChange?: (settingId: string, value: number | boolean) => void;
}

export class SettingsScreen extends BaseScreen {
  private settingsValue: Settings = {};
  private onSettingChange?: (settingId: string, value: number | boolean) => void;

  constructor(props: SettingsScreenProps) {
    super(props);
    this.onSettingChange = props.onSettingChange;
  }

  createUI(): UINodeType {
    return this.createRootContainer([
      this.createFullScreenBackground(),
      this.createContainerBackground(),

      // Settings controls
      this.createContentArea([
        this.createVolumeControl('Music Volume', 'musicVolume', 'musicVolume'),
        this.createToggleControl('Music', 'musicEnabled', 'musicEnabled'),
        this.createVolumeControl('SFX Volume', 'sfxVolume', 'sfxVolume'),
        this.createToggleControl('Sound Effects', 'sfxEnabled', 'sfxEnabled'),
      ], { left: 70, top: 70, width: 920, height: 580 }),

      // Side menu
      createSideMenu(this.ui, {
        title: 'Settings',
        bottomButton: this.getBackButton(),
        playSfx: this.playSfx,
      }),
    ]);
  }

  private createVolumeControl(
    label: string,
    settingKey: 'musicVolume' | 'sfxVolume',
    settingId: string
  ): UINodeType {
    return this.ui.View({
      style: { marginBottom: CONTROL_MARGIN_BOTTOM },
      children: [
        this.ui.View({
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            alignItems: 'center',
          },
          children: [
            this.ui.Text({
              text: label,
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                color: COLORS.textPrimary,
              },
            }),
            this.ui.View({
              style: {
                flexDirection: 'row',
                alignItems: 'center',
              },
              children: [
                this.ui.Pressable({
                  onClick: () => {
                    const currentSettings = this.settingsValue;
                    const currentValue = currentSettings[settingKey] || VOLUME_DEFAULT;
                    const newValue = Math.max(VOLUME_MIN, currentValue - VOLUME_STEP);
                    this.settingsValue[settingKey] = newValue;
                    this.onSettingChange?.(settingId, newValue);
                  },
                  style: {
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: CONTROL_BUTTON_BG,
                    borderRadius: 5,
                    marginRight: BUTTON_MARGIN,
                  },
                  children: this.ui.Text({
                    text: '-',
                    style: {
                      fontSize: 24,
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  }),
                }),
                this.ui.Text({
                  text: this.ui.bindingManager.derive([BindingType.PlayerData], (pd) => {
                    return String(pd?.settings?.[settingKey] || VOLUME_DEFAULT);
                  }),
                  style: {
                    fontSize: DIMENSIONS.fontSize.lg,
                    color: COLORS.textPrimary,
                    width: 40,
                    textAlign: 'center',
                  },
                }),
                this.ui.Pressable({
                  onClick: () => {
                    const currentSettings = this.settingsValue;
                    const currentValue = currentSettings[settingKey] || VOLUME_DEFAULT;
                    const newValue = Math.min(VOLUME_MAX, currentValue + VOLUME_STEP);
                    this.settingsValue[settingKey] = newValue;
                    this.onSettingChange?.(settingId, newValue);
                  },
                  style: {
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: CONTROL_BUTTON_BG,
                    borderRadius: 5,
                    marginLeft: BUTTON_MARGIN,
                  },
                  children: this.ui.Text({
                    text: '+',
                    style: {
                      fontSize: 24,
                      color: '#fff',
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

  private createToggleControl(
    label: string,
    settingKey: 'musicEnabled' | 'sfxEnabled',
    settingId: string
  ): UINodeType {
    return this.ui.View({
      style: { marginBottom: CONTROL_MARGIN_BOTTOM },
      children: [
        this.ui.View({
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          children: [
            this.ui.Text({
              text: label,
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                color: COLORS.textPrimary,
              },
            }),
            this.ui.Pressable({
              onClick: () => {
                const currentSettings = this.settingsValue;
                const newValue = !(currentSettings[settingKey] ?? true);
                this.settingsValue[settingKey] = newValue;
                this.onSettingChange?.(settingId, newValue);
              },
              style: {
                width: TOGGLE_WIDTH,
                height: TOGGLE_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: this.ui.bindingManager.derive([BindingType.PlayerData], (pd) => {
                  return (pd?.settings?.[settingKey] ?? true) ? TOGGLE_ON_COLOR : TOGGLE_OFF_COLOR;
                }),
                borderRadius: 20,
              },
              children: this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.PlayerData], (pd) => {
                  return (pd?.settings?.[settingKey] ?? true) ? 'ON' : 'OFF';
                }),
                style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  color: '#fff',
                  fontWeight: 'bold',
                },
              }),
            }),
          ],
        }),
      ],
    });
  }
}
