/**
 * Common Side Menu Component
 * Shared sidebar component used across all screens
 */

import { View, Text, Image, Pressable, UINode, Binding } from '../../ui';
import { COLORS } from '../../../../../shared/styles/colors';
import { DIMENSIONS } from '../../../../../shared/styles/dimensions';
import { MenuStats } from '../../../../../bloombeasts/gameManager';
import { tokenEmoji, diamondEmoji, serumEmoji } from '../../../../../shared/constants/emojis';
import { sideMenuDimensions, sideMenuButtonDimensions } from '../../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../../shared/constants/positions';

export interface SideMenuButton {
    label: string | Binding<string>;
    onClick: () => void;
    disabled?: boolean | Binding<boolean>;
    yOffset?: number; // Vertical offset from buttonStartPosition
}

export interface SideMenuConfig {
    /** Title text displayed at headerStartPosition */
    title?: string | Binding<string>;
    /** Custom content items to display at textStartPosition */
    customTextContent?: UINode[];
    /** Buttons to display at buttonStartPosition */
    buttons?: SideMenuButton[];
    /** Bottom button at headerStartPosition */
    bottomButton?: SideMenuButton;
    /** Stats binding for player info */
    stats: Binding<MenuStats | null>;
    /** Callback for XP bar click */
    onXPBarClick?: (title: string, message: string) => void;
}

/**
 * Create a common sidebar used across all screens
 */
export function createSideMenu(config: SideMenuConfig): UINode {
    const children: UINode[] = [];

    // Calculate positions relative to sidebar origin
    const headerRelativeX = sideMenuPositions.headerStartPosition.x - sideMenuPositions.x;
    const headerRelativeY = sideMenuPositions.headerStartPosition.y - sideMenuPositions.y;
    const textRelativeX = sideMenuPositions.textStartPosition.x - sideMenuPositions.x;
    const textRelativeY = sideMenuPositions.textStartPosition.y - sideMenuPositions.y;
    const buttonRelativeX = sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x;
    const buttonRelativeY = sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y;

    // Title at headerStartPosition (if provided)
    if (config.title) {
        children.push(
            View({
                style: {
                    position: 'absolute',
                    left: headerRelativeX,
                    top: headerRelativeY,
                },
                children: Text({
                    text: typeof config.title === 'string' ? new Binding(config.title) : config.title,
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
            View({
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
            View({
                style: {
                    position: 'absolute',
                    left: buttonRelativeX,
                    top: buttonRelativeY,
                    flexDirection: 'column',
                },
                children: config.buttons.map((button, index) =>
                    createSideMenuButton(
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

    // Player info at bottom of sidebar
    children.push(createPlayerInfo(config.stats, config.onXPBarClick));

    // Bottom button (if provided)
    if (config.bottomButton) {
        children.push(
            createSideMenuButton(
                config.bottomButton.label,
                headerRelativeX,
                headerRelativeY,
                config.bottomButton.onClick,
                config.bottomButton.disabled
            )
        );
    }

    return View({
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
            Image({
                source: new Binding({ uri: 'sideMenu' }),
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
    label: string | Binding<string>,
    x: number,
    y: number,
    onClick: () => void,
    disabled?: boolean | Binding<boolean>
): UINode {
    const labelBinding = typeof label === 'string' ? new Binding(label) : label;
    const disabledBinding = typeof disabled === 'boolean' ? new Binding(disabled) : (disabled || new Binding(false));

    return Pressable({
        onClick: () => {
            const isDisabled = disabledBinding.get();
            if (!isDisabled) {
                onClick();
            }
        },
        style: {
            position: 'absolute',
            left: x,
            top: y,
            width: sideMenuButtonDimensions.width,
            height: sideMenuButtonDimensions.height,
        },
        children: [
            // Button background image
            Image({
                source: new Binding({ uri: 'standardButton' }),
                style: {
                    position: 'absolute',
                    width: sideMenuButtonDimensions.width,
                    height: sideMenuButtonDimensions.height,
                    opacity: disabledBinding.derive(d => d ? 0.5 : 1) as any,
                },
            }),
            // Button text centered
            View({
                style: {
                    position: 'absolute',
                    width: sideMenuButtonDimensions.width,
                    height: sideMenuButtonDimensions.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                children: Text({
                    text: labelBinding,
                    style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: disabledBinding.derive(d => d ? '#888' : COLORS.textPrimary) as any,
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
 * Used at the bottom of side menus across all screens
 */
function createPlayerInfo(
    stats: Binding<MenuStats | null>,
    onXPBarClick?: (title: string, message: string) => void
): UINode {
    return View({
        style: {
            position: 'absolute',
            left: 0,
            top: sideMenuDimensions.height - 40,
            width: sideMenuDimensions.width,
            height: 50,
        },
        children: stats.derive(statsVal => {
            if (!statsVal) {
                return [];
            }

            const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
            const currentLevel = statsVal.playerLevel;
            const totalXP = statsVal.totalXP;
            const xpForCurrentLevel = xpThresholds[currentLevel - 1];
            const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
            const currentXP = totalXP - xpForCurrentLevel;
            const xpNeeded = xpForNextLevel - xpForCurrentLevel;
            const xpPercent = Math.min(100, (currentXP / xpNeeded) * 100);

            const barYOffset = 19;
            const barHeight = 11;

            return [
                // Player name
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerName.x,
                        top: 0,
                    },
                    children: Text({
                        text: new Binding('Player'),
                        style: {
                            fontSize: sideMenuPositions.playerName.size,
                            color: COLORS.textPrimary,
                            textAlign: sideMenuPositions.playerName.textAlign as any,
                        },
                    }),
                }),

                // XP Bar
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerExperienceBar.x,
                        top: barYOffset,
                        width: sideMenuPositions.playerExperienceBar.maxWidth,
                        height: barHeight,
                    },
                    children: Pressable({
                        onClick: () => {
                            if (onXPBarClick) {
                                const title = `Level ${currentLevel}`;
                                const message = `Current XP: ${currentXP} / ${xpNeeded}\n\nTotal XP: ${totalXP}`;
                                onXPBarClick(title, message);
                            }
                        },
                        style: {
                            width: '100%',
                            height: '100%',
                        },
                        children: Image({
                            source: new Binding({ uri: 'experienceBar' }),
                            style: {
                                width: `${xpPercent}%`,
                                height: barHeight,
                            },
                        }),
                    }),
                }),

                // Level text
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerLevel.x,
                        top: barYOffset,
                        width: 20,
                        height: barHeight,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    children: Text({
                        text: new Binding(`${currentLevel}`),
                        style: {
                            fontSize: sideMenuPositions.playerLevel.size,
                            color: COLORS.textPrimary,
                            textAlign: 'center',
                        },
                    }),
                }),
            ];
        }) as any,
    });
}

/**
 * Helper: Create a text row component
 */
export function createTextRow(text: string | Binding<string>, top: number = 0): UINode {
    return View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: Text({
            text: typeof text === 'string' ? new Binding(text) : text,
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
export function createResourceRow(emoji: string, amount: number | Binding<number>, top: number = 0): UINode {
    const amountBinding = typeof amount === 'number' ? new Binding(amount) : amount;

    return View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: Text({
            text: amountBinding.derive(a => `${emoji} ${a}`) as any,
            style: {
                fontSize: DIMENSIONS.fontSize.md,
                color: COLORS.textPrimary,
            },
        }),
    });
}
