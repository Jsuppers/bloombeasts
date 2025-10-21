/**
 * Settings Screen - Refactored with UI Component System
 */

import { View, Text, Image, Pressable, UINode, Binding } from '../ui';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS } from '../../../../shared/styles/dimensions';
import { SoundSettings } from '../../../../bloombeasts/systems/SoundManager';
import { MenuStats } from '../../../../bloombeasts/gameManager';
import { createSidebar } from './commonComponents';

export class SettingsScreenNew {
    // State bindings
    private settings: Binding<SoundSettings>;
    private stats: Binding<MenuStats | null> = new Binding<MenuStats | null>(null);

    private onSettingChangeCallback: ((settingId: string, value: any) => void) | null = null;
    private onBackCallback: (() => void) | null = null;
    private renderCallback: (() => void) | null = null;

    constructor() {
        this.settings = new Binding({
            musicVolume: 80,
            sfxVolume: 80,
            musicEnabled: true,
            sfxEnabled: true,
        });

        // Subscribe to settings changes to trigger re-renders
        this.settings.subscribe(() => {
            if (this.renderCallback) {
                this.renderCallback();
            }
        });
    }

    /**
     * Create the settings UI
     */
    createUI(): UINode {
        return View({
            style: {
                width: '100%',
                height: '100%',
                position: 'relative',
            },
            children: [
                // Background image (full screen)
                this.createBackground(),

                // Main content area
                this.createMainContent(),

                // Side menu (absolutely positioned)
                this.createSideMenu(),
            ],
        });
    }

    /**
     * Create full-screen background image
     */
    private createBackground(): UINode {
        return Image({
            source: new Binding({ uri: 'background' }),
            style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
            },
        });
    }

    /**
     * Create main content area with settings
     */
    private createMainContent(): UINode {
        return View({
            style: {
                position: 'absolute',
                width: 1100, // Don't overlap sidebar (1280 - 180 for sidebar and margins)
                height: '100%',
                padding: 40,
            },
            children: [
                // Settings container
                View({
                    style: {
                        padding: 40,
                        backgroundColor: COLORS.cardBackground,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: COLORS.borderDefault,
                    },
                    children: [
                        // Music settings
                        this.createVolumeControl('Music Volume', 'musicVolume', 'music-volume'),
                        this.createToggleControl('Music', 'musicEnabled', 'music-enabled'),

                        // SFX settings
                        this.createVolumeControl('SFX Volume', 'sfxVolume', 'sfx-volume'),
                        this.createToggleControl('Sound Effects', 'sfxEnabled', 'sfx-enabled'),
                    ],
                }),
            ],
        });
    }

    /**
     * Create volume control slider
     */
    private createVolumeControl(
        label: string,
        settingKey: keyof SoundSettings,
        settingId: string
    ): UINode {
        return View({
            style: {
                marginBottom: 30,
            },
            children: [
                // Label and value
                View({
                    style: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    },
                    children: [
                        Text({
                            text: new Binding(label),
                            style: {
                                fontSize: DIMENSIONS.fontSize.xl,
                                color: COLORS.textPrimary,
                            },
                        }),
                        Text({
                            text: this.settings.derive(s => `${s[settingKey as 'musicVolume' | 'sfxVolume']}%`),
                            style: {
                                fontSize: DIMENSIONS.fontSize.xl,
                                color: COLORS.success,
                            },
                        }),
                    ],
                }),

                // Slider
                Pressable({
                    onClick: (relativeX?: number) => {
                        if (relativeX !== undefined && this.onSettingChangeCallback) {
                            // Convert relative position (0-1) to volume (0-100)
                            const newValue = Math.round(relativeX * 100);
                            const clampedValue = Math.max(0, Math.min(100, newValue));
                            this.onSettingChangeCallback(settingId, clampedValue);

                            // Update the binding immediately for responsive UI
                            const currentSettings = this.settings.get();
                            this.settings.set({
                                ...currentSettings,
                                [settingKey]: clampedValue,
                            });
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
                        View({
                            style: {
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: this.settings.derive(s =>
                                    `${s[settingKey as 'musicVolume' | 'sfxVolume']}%`
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
        settingKey: keyof SoundSettings,
        settingId: string
    ): UINode {
        return View({
            style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 30,
            },
            children: [
                Text({
                    text: new Binding(label),
                    style: {
                        fontSize: DIMENSIONS.fontSize.xl,
                        color: COLORS.textPrimary,
                    },
                }),

                // Toggle button
                Pressable({
                    onClick: () => {
                        if (this.onSettingChangeCallback) {
                            const currentSettings = this.settings.get();
                            const currentValue = currentSettings[settingKey as 'musicEnabled' | 'sfxEnabled'];
                            this.onSettingChangeCallback(settingId, !currentValue);
                        }
                    },
                    style: {
                        width: 120,
                        padding: 12,
                        backgroundColor: this.settings.derive(s =>
                            s[settingKey as 'musicEnabled' | 'sfxEnabled']
                                ? COLORS.buttonSuccess
                                : COLORS.buttonPrimary
                        ),
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: this.settings.derive(s =>
                            s[settingKey as 'musicEnabled' | 'sfxEnabled']
                                ? COLORS.borderSuccess
                                : COLORS.borderDefault
                        ),
                    },
                    children: Text({
                        text: this.settings.derive(s =>
                            s[settingKey as 'musicEnabled' | 'sfxEnabled'] ? 'ON' : 'OFF'
                        ),
                        style: {
                            fontSize: DIMENSIONS.fontSize.md,
                            color: COLORS.textPrimary,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        },
                    }),
                }),
            ],
        });
    }

    /**
     * Create side menu
     */
    private createSideMenu(): UINode {
        const customContent = [
            // Title
            Text({
                text: new Binding('Settings'),
                style: {
                    fontSize: DIMENSIONS.fontSize.lg,
                    color: COLORS.textPrimary,
                    fontWeight: 'bold',
                    marginBottom: 20,
                },
            }),
        ];

        return createSidebar({
            showMessage: false,
            showResources: false,
            customContent,
            bottomButton: {
                label: 'Back',
                onClick: () => {
                    if (this.onBackCallback) {
                        this.onBackCallback();
                    }
                },
                disabled: false,
            },
            stats: this.stats,
        });
    }

    /**
     * Update the screen with new data
     */
    update(
        settings: SoundSettings,
        onSettingChange: (settingId: string, value: any) => void,
        onBack: () => void,
        stats?: MenuStats
    ): void {
        this.settings.set(settings);
        if (stats) {
            this.stats.set(stats);
        }
        this.onSettingChangeCallback = onSettingChange;
        this.onBackCallback = onBack;
    }

    /**
     * Set render callback (called when screen needs to re-render)
     */
    setRenderCallback(callback: () => void): void {
        this.renderCallback = callback;
    }

    /**
     * Cleanup
     */
    destroy(): void {
        // No animations to clean up for now
    }
}
