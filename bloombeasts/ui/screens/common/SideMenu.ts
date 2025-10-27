/**
 * Common Side Menu Component
 * Shared sidebar used across all unified screens (Horizon & Web)
 */

import { COLORS } from '../../styles/colors';
import { DIMENSIONS } from '../../styles/dimensions';
import { sideMenuButtonDimensions } from '../../constants/dimensions';
import { sideMenuPositions } from '../../constants/positions';
import type { MenuStats } from '../../../../bloombeasts/gameManager';
import { UINodeType } from '../ScreenUtils';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import type { ValueBindingBase } from '../../types/bindings';

// SideMenu-specific constants
const sideMenuDimensions = {
  width: 127,
  height: 465,
};

export interface SideMenuButton {
    label: string | ValueBindingBase<string>;
    onClick: () => void;
    disabled?: boolean | ValueBindingBase<boolean>;
    yOffset?: number; // Vertical offset from buttonStartPosition
}

export interface SideMenuConfig {
    /** Title text displayed at headerStartPosition */
    title?: string | ValueBindingBase<string>;
    /** Custom content items to display at textStartPosition */
    customTextContent?: UINodeType[];
    /** Buttons to display at buttonStartPosition */
    buttons?: SideMenuButton[];
    /** Bottom button at headerStartPosition */
    bottomButton?: SideMenuButton;
    /** Stats binding for player info */
    stats: ValueBindingBase<MenuStats | null> | any;
    /** Callback for XP bar click */
    onXPBarClick?: (title: string, message: string) => void;
}

/**
 * Create a common sidebar used across all screens
 */
export function createSideMenu(ui: UIMethodMappings, config: SideMenuConfig): UINodeType {
    const children: UINodeType[] = [];

    // Calculate positions relative to sidebar origin (using sideMenuPositions)
    const headerRelativeX = sideMenuPositions.headerStartPosition.x - sideMenuPositions.x;
    const headerRelativeY = sideMenuPositions.headerStartPosition.y - sideMenuPositions.y;
    const textRelativeX = sideMenuPositions.textStartPosition.x - sideMenuPositions.x;
    const textRelativeY = sideMenuPositions.textStartPosition.y - sideMenuPositions.y;
    const buttonRelativeX = sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x;
    const buttonRelativeY = sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y;

    // Title at headerStartPosition (if provided)
    if (config.title) {
        children.push(
            ui.View({
                style: {
                    position: 'absolute',
                    left: headerRelativeX,
                    top: headerRelativeY,
                },
                children: ui.Text({
                    text: typeof config.title === 'string' ? new ui.Binding(config.title) : config.title,
                    style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: COLORS.textPrimary,
                        fontWeight: 'bold',
                    },
                }),
            })
        );
    }

    // Custom text content at textStartPosition
    if (config.customTextContent && config.customTextContent.length > 0) {
        children.push(
            ui.View({
                style: {
                    position: 'absolute',
                    left: textRelativeX,
                    top: textRelativeY,
                    flexDirection: 'column',
                },
                children: config.customTextContent,
            })
        );
    }

    // Buttons at buttonStartPosition
    if (config.buttons && config.buttons.length > 0) {
        children.push(
            ui.View({
                style: {
                    position: 'absolute',
                    left: buttonRelativeX,
                    top: buttonRelativeY,
                    flexDirection: 'column',
                },
                children: config.buttons.map(button =>
                    createSideMenuButton(
                        ui,
                        button.label,
                        0,
                        button.yOffset !== undefined ? button.yOffset : 0,
                        button.onClick,
                        button.disabled
                    )
                ),
            })
        );
    }

    // Player info at bottom of sidebar (aligned to bottom like web deployment)
    children.push(
        ui.View({
            style: {
                position: 'absolute',
                left: 0,
                top: sideMenuDimensions.height - 40,
                width: sideMenuDimensions.width,
                height: 50,
            },
            children: createPlayerInfo(ui, config.stats, config.onXPBarClick),
        })
    );

    // Bottom button (if provided, at headerStartPosition)
    if (config.bottomButton) {
        children.push(
            createSideMenuButton(
                ui,
                config.bottomButton.label,
                headerRelativeX,
                headerRelativeY,
                config.bottomButton.onClick,
                config.bottomButton.disabled
            )
        );
    }

    return ui.View({
        style: {
            position: 'absolute',
            left: sideMenuPositions.x,
            top: sideMenuPositions.y,
            width: sideMenuDimensions.width,
            height: sideMenuDimensions.height,
            flexDirection: 'column',
        },
        children: [
            // Sidebar background image
            ui.Image({
                source: ui.Binding.derive(
                    [ui.assetsLoadedBinding],
                    (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('side-menu') : null
                ),
                style: {
                    position: 'absolute',
                    width: sideMenuDimensions.width,
                    height: sideMenuDimensions.height,
                    top: 0,
                    left: 0,
                },
            }),
            // Sidebar content
            ...children,
        ],
    });
}

/**
 * Create a side menu button with image background
 */
function createSideMenuButton(
    ui: UIMethodMappings,
    label: string | ValueBindingBase<string>,
    x: number,
    y: number,
    onClick: () => void,
    disabled?: boolean | ValueBindingBase<boolean>
): UINodeType {
    const labelBinding = typeof label === 'string' ? new ui.Binding(label) : label;
    const disabledValue = typeof disabled === 'boolean' ? disabled : false;
    const disabledBinding = typeof disabled === 'object' && 'get' in disabled ? disabled : undefined;

    return ui.Pressable({
        onClick: onClick,
        disabled: disabledBinding || disabledValue,
        style: {
            position: 'absolute',
            left: x,
            top: y,
            width: sideMenuButtonDimensions.width,
            height: sideMenuButtonDimensions.height,
        },
        children: [
            // Button background image
            ui.Image({
                source: ui.Binding.derive(
                    [ui.assetsLoadedBinding],
                    (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('standard-button') : null
                ),
                style: {
                    position: 'absolute',
                    width: sideMenuButtonDimensions.width,
                    height: sideMenuButtonDimensions.height,
                    opacity: disabledValue ? 0.5 : 1,
                },
            }),
            // Button text centered
            ui.View({
                style: {
                    position: 'absolute',
                    width: sideMenuButtonDimensions.width,
                    height: sideMenuButtonDimensions.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                children: ui.Text({
                    text: labelBinding,
                    style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: disabledValue ? '#888' : COLORS.textPrimary,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textAlignVertical: 'center',
                    },
                }),
            }),
        ],
    });
}

/**
 * Create player info display (name, level, XP bar)
 * Positioned using sideMenuPositions
 */
function createPlayerInfo(
    ui: UIMethodMappings,
    stats: ValueBindingBase<MenuStats | null> | any,
    onXPBarClick?: (title: string, message: string) => void
): UINodeType {
    // Create derived bindings for reactive values (Horizon best practice)
    // Derive final values directly from base binding to avoid chaining
    const xpWidthBinding = stats.derive((statsVal: MenuStats | null) => {
        if (!statsVal) return '0%';
        const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
        const currentLevel = statsVal.playerLevel;
        const totalXP = statsVal.totalXP;
        const xpForCurrentLevel = xpThresholds[currentLevel - 1];
        const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
        const currentXP = totalXP - xpForCurrentLevel;
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;
        const xpPercent = Math.min(100, (currentXP / xpNeeded) * 100);
        return `${xpPercent}%`;
    });

    const levelTextBinding = stats.derive((statsVal: MenuStats | null) =>
        statsVal ? `${statsVal.playerLevel}` : '1'
    );

    return ui.View({
        style: {
            position: 'relative',
        },
        children: [
            // Player name
            ui.View({
                style: {
                    position: 'absolute',
                    left: sideMenuPositions.playerName.x,
                    top: 0,
                },
                children: ui.Text({
                    text: new ui.Binding('Player'),
                    style: {
                        fontSize: sideMenuPositions.playerName.size,
                        color: COLORS.textPrimary,
                        textAlign: sideMenuPositions.playerName.textAlign as any,
                    },
                }),
            }),

            // XP Bar
            ui.View({
                style: {
                    position: 'absolute',
                    left: sideMenuPositions.playerExperienceBar.x,
                    top: 19, // Offset from player name
                    width: sideMenuPositions.playerExperienceBar.maxWidth,
                    height: 11,
                },
                children: (() => {
                    // Create a variable to hold the current stats value
                    let currentStats: MenuStats | null = null;

                    // Use a derived binding to keep currentStats updated
                    // This binding is used in the XP width calculation, so it will be evaluated
                    const xpWidthWithTracking = ui.Binding.derive(
                        [stats],
                        (statsVal: MenuStats | null) => {
                            currentStats = statsVal; // Track the current value
                            if (!statsVal) return 0;
                            const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
                            const currentLevel = statsVal.playerLevel;
                            const totalXP = statsVal.totalXP;
                            const xpForCurrentLevel = xpThresholds[currentLevel - 1];
                            const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
                            const currentXP = totalXP - xpForCurrentLevel;
                            const xpNeeded = xpForNextLevel - xpForCurrentLevel;
                            const progress = xpNeeded > 0 ? (currentXP / xpNeeded) : 1;
                            return Math.round(progress * sideMenuPositions.playerExperienceBar.maxWidth);
                        }
                    );

                    return ui.Pressable({
                        onClick: () => {
                            if (onXPBarClick && currentStats) {
                                const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
                                const currentLevel = currentStats.playerLevel;
                                const totalXP = currentStats.totalXP;
                                const xpForCurrentLevel = xpThresholds[currentLevel - 1];
                                const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
                                const currentXP = totalXP - xpForCurrentLevel;
                                const xpNeeded = xpForNextLevel - xpForCurrentLevel;
                                const title = `Level ${currentLevel}`;
                                const message = `Current XP: ${currentXP} / ${xpNeeded}\n\nTotal XP: ${totalXP}`;
                                onXPBarClick(title, message);
                            }
                        },
                        style: {
                            width: '100%',
                            height: '100%',
                        },
                        children: ui.Image({
                            source: ui.Binding.derive(
                                [ui.assetsLoadedBinding],
                                (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('experience-bar') : null
                            ),
                            style: {
                                width: xpWidthWithTracking,
                                height: 11,
                            },
                        }),
                    });
                })(),
            }),

            // Level text (centered on XP bar)
            ui.View({
                style: {
                    position: 'absolute',
                    left: sideMenuPositions.playerLevel.x,
                    top: 19,
                    width: 20,
                    height: 11,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                children: ui.Text({
                    text: levelTextBinding,
                    style: {
                        fontSize: sideMenuPositions.playerLevel.size,
                        color: COLORS.textPrimary,
                        textAlign: 'center',
                    },
                }),
            }),
        ],
    });
}

/**
 * Helper: Create a text row component
 */
export function createTextRow(ui: UIMethodMappings, text: string | ValueBindingBase<string>, top: number = 0): UINodeType {
    return ui.View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: ui.Text({
            text: typeof text === 'string' ? new ui.Binding(text) : text,
            style: {
                fontSize: DIMENSIONS.fontSize.md,
                color: COLORS.textPrimary,
            },
        }),
    });
}

/**
 * Helper: Create a resource row (emoji + count)
 */
export function createResourceRow(ui: UIMethodMappings, 
    emoji: string,
    amount: number | ValueBindingBase<number>,
    top: number = 0
): UINodeType {
    const amountText = typeof amount === 'number'
        ? new ui.Binding(`${emoji} ${amount}`)
        : (amount as any).derive((a: number) => `${emoji} ${a}`);

    return ui.View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: ui.Text({
            text: amountText,
            style: {
                fontSize: 18,
                color: COLORS.textPrimary,
            },
        }),
    });
}
